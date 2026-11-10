import unittest

from nova_core_ingestion import NovaCoreIngestionError, submit_observation


class FakeResponse:
    def __init__(self, status=201, body=b'{"accepted":true,"verification_status":"unverified"}'):
        self.status, self.body = status, body

    def read(self, size=-1):
        return self.body[:size]


class FakeConnection:
    last = None

    def __init__(self, host, port, timeout):
        self.host, self.port, self.timeout = host, port, timeout
        self.closed = False
        self.request_args = None
        FakeConnection.last = self

    def request(self, method, path, body, headers):
        self.request_args = (method, path, body, headers)

    def getresponse(self):
        return FakeResponse()

    def close(self):
        self.closed = True


class RejectedConnection(FakeConnection):
    def getresponse(self):
        return FakeResponse(403, b'{"error":"request_not_authorized"}')


class NovaGridIngestionTests(unittest.TestCase):
    def setUp(self):
        self.env = {
            "NOVA_CORE_INGESTION_URL": "https://nova-core-ingest.example.workers.dev/api/v1/observations",
            "NOVA_CORE_ACCESS_CLIENT_ID": "grid-client-id",
            "NOVA_CORE_ACCESS_CLIENT_SECRET": "grid-client-secret",
        }
        self.payload = {
            "site_id": "registered-energy-site",
            "source_id": "neogrid-inverter-01",
            "module": "neogrid",
            "metric": "energy.solar_power",
            "value": 18.7,
            "unit": "kW",
            "observed_at": "2026-11-10T12:00:00Z",
            "idempotency_key": "inverter-event-0001",
            "provenance": {"provider": "registered-inverter-gateway", "acquisition_method": "sensor"},
            "quality_flags": [],
        }

    def test_posts_with_server_side_access_headers(self):
        result = submit_observation(self.payload, environ=self.env, connection_factory=FakeConnection)
        method, path, body, headers = FakeConnection.last.request_args
        self.assertEqual((method, path), ("POST", "/api/v1/observations"))
        self.assertEqual(headers["CF-Access-Client-Id"], "grid-client-id")
        self.assertEqual(headers["CF-Access-Client-Secret"], "grid-client-secret")
        self.assertNotIn("grid-client-secret", body.decode())
        self.assertEqual(result["verification_status"], "unverified")
        self.assertTrue(FakeConnection.last.closed)

    def test_missing_credentials_fail_closed(self):
        env = dict(self.env)
        env.pop("NOVA_CORE_ACCESS_CLIENT_SECRET")
        with self.assertRaisesRegex(NovaCoreIngestionError, "not_configured"):
            submit_observation(self.payload, environ=env, connection_factory=FakeConnection)

    def test_rejects_invalid_endpoint_and_header_injection(self):
        for endpoint in (
            "http://nova-core.example/api/v1/observations",
            "https://nova-core.example/other",
            "https://nova-core.example/api/v1/observations?x=1",
            "https://nova-core.example:99999/api/v1/observations",
        ):
            with self.subTest(endpoint=endpoint), self.assertRaises(NovaCoreIngestionError):
                submit_observation(self.payload, environ=dict(self.env, NOVA_CORE_INGESTION_URL=endpoint),
                                   connection_factory=FakeConnection)
        with self.assertRaisesRegex(NovaCoreIngestionError, "credentials_invalid"):
            submit_observation(self.payload, environ=dict(self.env, NOVA_CORE_ACCESS_CLIENT_ID="grid\r\nX: y"),
                               connection_factory=FakeConnection)

    def test_rejected_request_does_not_echo_upstream_body(self):
        with self.assertRaises(NovaCoreIngestionError) as caught:
            submit_observation(self.payload, environ=self.env, connection_factory=RejectedConnection)
        self.assertEqual(caught.exception.status, 403)
        self.assertNotIn("grid-client-secret", str(caught.exception))


if __name__ == "__main__":
    unittest.main()
