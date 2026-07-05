"""Backend tests for portfolio API - iteration 3"""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://github-portfolio-23.preview.emergentagent.com").rstrip("/")
ANALYTICS_TOKEN = "r_0CJIn7mLmAxRaLU9dBlYYHp4yADitI"


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


class TestProfile:
    def test_profile_shape(self, client):
        r = client.get(f"{BASE_URL}/api/profile", timeout=20)
        assert r.status_code == 200
        data = r.json()
        p = data["profile"]
        assert isinstance(p.get("value_prop"), str) and len(p["value_prop"]) > 20
        assert isinstance(p["impact_metrics"], list) and len(p["impact_metrics"]) == 4
        for m in p["impact_metrics"]:
            assert "value" in m and "label" in m
        assert isinstance(p["why_hire_me"], list) and len(p["why_hire_me"]) == 3
        for w in p["why_hire_me"]:
            assert "title" in w and "body" in w
        assert "dicebear" in (p.get("avatar_url") or "").lower()

    def test_profile_experience_practo(self, client):
        r = client.get(f"{BASE_URL}/api/profile", timeout=20)
        exp = r.json()["experience"]
        assert exp[0]["role"] == "Business Analyst Intern"
        assert exp[0]["company"] == "Practo Technologies"
        assert exp[0]["current"] is True


class TestTrack:
    def test_track_ok(self, client):
        r = client.post(f"{BASE_URL}/api/track", json={
            "type": "TEST_page_view", "label": "TEST_home", "meta": {"src": "TEST"}
        }, timeout=15)
        assert r.status_code == 200
        assert r.json() == {"ok": True}

    def test_track_invalid_type(self, client):
        r = client.post(f"{BASE_URL}/api/track", json={"type": "", "label": "x"}, timeout=15)
        assert r.status_code == 400


class TestAnalytics:
    def test_analytics_invalid_token(self, client):
        r = client.get(f"{BASE_URL}/api/analytics", params={"token": "wrong"}, timeout=15)
        assert r.status_code == 403

    def test_analytics_valid_token(self, client):
        client.post(f"{BASE_URL}/api/track", json={
            "type": "TEST_project_click", "label": "TEST_hiremory"
        }, timeout=15)
        r = client.get(f"{BASE_URL}/api/analytics", params={"token": ANALYTICS_TOKEN}, timeout=20)
        assert r.status_code == 200
        d = r.json()
        for key in ["totals_by_type", "top_projects", "top_referrers", "daily", "contact_messages", "recent_events"]:
            assert key in d


class TestContact:
    def test_contact_success(self, client):
        r = client.post(f"{BASE_URL}/api/contact", json={
            "name": "TEST_User",
            "email": "test+iter3@example.com",
            "message": "TEST iteration 3 message"
        }, timeout=25)
        assert r.status_code == 200
        d = r.json()
        assert d.get("ok") is True
        assert "email_sent" in d

    def test_contact_missing_field(self, client):
        r = client.post(f"{BASE_URL}/api/contact", json={"name": "x", "email": "a@b.com"}, timeout=15)
        assert r.status_code == 400
