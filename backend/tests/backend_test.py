"""Backend API tests for Abhishek Banaj Portfolio (iteration 2)."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://github-portfolio-23.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# --- Profile endpoint (resume + practo experience + featured projects) ---
class TestProfile:
    def test_profile_status(self, client):
        r = client.get(f"{API}/profile", timeout=20)
        assert r.status_code == 200
        self.data = r.json()

    def test_resume_urls(self, client):
        data = client.get(f"{API}/profile", timeout=20).json()
        p = data["profile"]
        assert p.get("resume_url"), "resume_url missing"
        assert "customer-assets.emergentagent.com" in p["resume_url"] or p["resume_url"].startswith("http")
        assert p.get("resume_drive_url"), "resume_drive_url missing"
        assert "drive.google.com" in p["resume_drive_url"]

    def test_practo_experience(self, client):
        data = client.get(f"{API}/profile", timeout=20).json()
        exp = data["experience"]
        assert len(exp) >= 1
        first = exp[0]
        assert first["role"] == "Business Analyst Intern"
        assert first["company"] == "Practo Technologies"
        assert first["current"] is True
        assert len(first["bullets"]) == 5
        joined = " ".join(first["bullets"]).lower()
        assert "ltv" in joined and "cac" in joined
        assert "cohort" in joined
        assert "redshift" in joined

    def test_featured_projects(self, client):
        data = client.get(f"{API}/profile", timeout=20).json()
        fp = data["featured_projects"]
        assert len(fp) == 2
        ids = {p["id"] for p in fp}
        assert ids == {"hiremory", "nl-analytics"}


# --- Contact endpoint with Resend ---
class TestContact:
    def test_contact_success_with_email(self, client):
        payload = {
            "name": "TEST_Automated Tester",
            "email": "tester@example.com",
            "message": "Automated backend test — please ignore. iteration_2",
        }
        r = client.post(f"{API}/contact", json=payload, timeout=30)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["ok"] is True
        assert "id" in data
        # Resend key is configured — email_sent should be True
        assert data["email_sent"] is True, f"email_sent should be True; error={data.get('email_error')}"
        assert data.get("email_error") is None

    def test_contact_validation_missing_fields(self, client):
        r = client.post(f"{API}/contact", json={"name": "x", "email": "", "message": ""}, timeout=15)
        assert r.status_code == 400

    def test_contact_validation_bad_email(self, client):
        r = client.post(f"{API}/contact", json={"name": "x", "email": "notanemail", "message": "hi"}, timeout=15)
        assert r.status_code == 400


# --- Projects endpoint (light retest of role filtering) ---
class TestProjects:
    def test_projects_all(self, client):
        r = client.get(f"{API}/projects", timeout=30)
        assert r.status_code == 200
        d = r.json()
        assert "projects" in d and "counts" in d
        assert d["total"] > 0

    def test_projects_role_filter(self, client):
        r = client.get(f"{API}/projects", params={"role": "ai-engineer"}, timeout=30)
        assert r.status_code == 200
        d = r.json()
        for p in d["projects"]:
            assert "ai-engineer" in p["roles"]
