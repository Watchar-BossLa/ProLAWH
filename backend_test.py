#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for ProLAWH
Tests all major backend functionality including authentication, courses, mentorship, jobs, chat, and analytics.
"""

import requests
import json
import time
from typing import Dict, Any, Optional

# Backend URL from environment
BACKEND_URL = "https://bbe52efb-1c2a-48b7-a089-5f657e640a20.preview.emergentagent.com"
API_BASE = f"{BACKEND_URL}/api"

class ProLAWHBackendTester:
    def __init__(self):
        self.session = requests.Session()
        self.auth_token = None
        self.user_data = None
        self.test_results = []
        
    def log_test(self, test_name: str, success: bool, details: str = ""):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if details:
            print(f"   Details: {details}")
        
        self.test_results.append({
            "test": test_name,
            "success": success,
            "details": details
        })
        
    def make_request(self, method: str, endpoint: str, data: Dict = None, auth: bool = True) -> tuple:
        """Make HTTP request with proper headers"""
        url = f"{API_BASE}{endpoint}"
        headers = {"Content-Type": "application/json"}
        
        if auth and self.auth_token:
            headers["Authorization"] = f"Bearer {self.auth_token}"
            
        try:
            if method.upper() == "GET":
                response = self.session.get(url, headers=headers)
            elif method.upper() == "POST":
                response = self.session.post(url, headers=headers, json=data)
            elif method.upper() == "PUT":
                response = self.session.put(url, headers=headers, json=data)
            else:
                return False, f"Unsupported method: {method}"
                
            return True, response
        except Exception as e:
            return False, f"Request failed: {str(e)}"
    
    def test_health_check(self):
        """Test basic health endpoint"""
        success, response = self.make_request("GET", "/health", auth=False)
        
        if not success:
            self.log_test("Health Check", False, response)
            return False
            
        if response.status_code == 200:
            data = response.json()
            if data.get("status") == "healthy":
                self.log_test("Health Check", True, "API is healthy")
                return True
                
        self.log_test("Health Check", False, f"Status: {response.status_code}")
        return False
    
    def test_user_registration(self):
        """Test user registration"""
        user_data = {
            "email": "sarah.johnson@prolawh.com",
            "password": "SecurePass123!",
            "full_name": "Sarah Johnson",
            "role": "learner"
        }
        
        success, response = self.make_request("POST", "/auth/register", user_data, auth=False)
        
        if not success:
            self.log_test("User Registration", False, response)
            return False
            
        if response.status_code == 200:
            data = response.json()
            if "access_token" in data and "user" in data:
                self.auth_token = data["access_token"]
                self.user_data = data["user"]
                self.log_test("User Registration", True, f"User created: {data['user']['full_name']}")
                return True
                
        self.log_test("User Registration", False, f"Status: {response.status_code}, Response: {response.text}")
        return False
    
    def test_user_login(self):
        """Test user login"""
        login_data = {
            "email": "sarah.johnson@prolawh.com",
            "password": "SecurePass123!"
        }
        
        success, response = self.make_request("POST", "/auth/login", login_data, auth=False)
        
        if not success:
            self.log_test("User Login", False, response)
            return False
            
        if response.status_code == 200:
            data = response.json()
            if "access_token" in data:
                self.auth_token = data["access_token"]
                self.user_data = data["user"]
                self.log_test("User Login", True, f"Login successful for: {data['user']['full_name']}")
                return True
        elif response.status_code == 401:
            # Try registration first, then login
            if self.test_user_registration():
                return True
                
        self.log_test("User Login", False, f"Status: {response.status_code}")
        return False
    
    def test_auth_me(self):
        """Test getting current user profile"""
        success, response = self.make_request("GET", "/auth/me")
        
        if not success:
            self.log_test("Get Current User", False, response)
            return False
            
        if response.status_code == 200:
            data = response.json()
            if "user_id" in data and "email" in data:
                self.log_test("Get Current User", True, f"Profile retrieved: {data['full_name']}")
                return True
                
        self.log_test("Get Current User", False, f"Status: {response.status_code}")
        return False
    
    def test_dashboard_stats(self):
        """Test dashboard statistics endpoint"""
        success, response = self.make_request("GET", "/dashboard/stats")
        
        if not success:
            self.log_test("Dashboard Stats", False, response)
            return False
            
        if response.status_code == 200:
            data = response.json()
            expected_fields = ["courses_completed", "skills_verified", "network_connections", "learning_streak"]
            
            if all(field in data for field in expected_fields):
                self.log_test("Dashboard Stats", True, f"Stats retrieved: {len(data)} metrics")
                return True
                
        self.log_test("Dashboard Stats", False, f"Status: {response.status_code}")
        return False
    
    def test_ai_recommendations(self):
        """Test AI recommendations endpoint"""
        success, response = self.make_request("GET", "/dashboard/recommendations")
        
        if not success:
            self.log_test("AI Recommendations", False, response)
            return False
            
        if response.status_code == 200:
            data = response.json()
            if "courses" in data and "mentors" in data and "opportunities" in data:
                self.log_test("AI Recommendations", True, "Recommendations generated successfully")
                return True
                
        self.log_test("AI Recommendations", False, f"Status: {response.status_code}")
        return False
    
    def test_courses_endpoint(self):
        """Test courses listing endpoint"""
        success, response = self.make_request("GET", "/courses", auth=False)
        
        if not success:
            self.log_test("Get Courses", False, response)
            return False
            
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                self.log_test("Get Courses", True, f"Retrieved {len(data)} courses")
                return True
                
        self.log_test("Get Courses", False, f"Status: {response.status_code}")
        return False
    
    def test_course_enrollment(self):
        """Test course enrollment"""
        # First get available courses
        success, response = self.make_request("GET", "/courses", auth=False)
        
        if not success or response.status_code != 200:
            self.log_test("Course Enrollment", False, "Could not fetch courses")
            return False
            
        courses = response.json()
        if not courses:
            self.log_test("Course Enrollment", False, "No courses available")
            return False
            
        # Try to enroll in first course
        course_id = courses[0].get("course_id", "test-course-1")
        success, response = self.make_request("POST", f"/courses/{course_id}/enroll")
        
        if not success:
            self.log_test("Course Enrollment", False, response)
            return False
            
        if response.status_code == 200:
            data = response.json()
            if "message" in data and "progress" in data:
                self.log_test("Course Enrollment", True, f"Enrolled in course: {course_id}")
                return True
                
        self.log_test("Course Enrollment", False, f"Status: {response.status_code}")
        return False
    
    def test_mentors_endpoint(self):
        """Test mentors listing endpoint"""
        success, response = self.make_request("GET", "/mentors", auth=False)
        
        if not success:
            self.log_test("Get Mentors", False, response)
            return False
            
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                self.log_test("Get Mentors", True, f"Retrieved {len(data)} mentors")
                return True
                
        self.log_test("Get Mentors", False, f"Status: {response.status_code}")
        return False
    
    def test_mentorship_request(self):
        """Test mentorship request"""
        request_data = {
            "mentor_id": "mentor-123",
            "message": "I would like to learn more about full-stack development",
            "preferred_schedule": "weekends"
        }
        
        success, response = self.make_request("POST", "/mentorship/request", request_data)
        
        if not success:
            self.log_test("Mentorship Request", False, response)
            return False
            
        if response.status_code == 200:
            data = response.json()
            if "message" in data and "connection" in data:
                self.log_test("Mentorship Request", True, "Mentorship request sent successfully")
                return True
        elif response.status_code == 422:
            # Log validation error details
            error_details = response.json().get("detail", "Validation error")
            self.log_test("Mentorship Request", False, f"Validation error: {error_details}")
            return False
                
        self.log_test("Mentorship Request", False, f"Status: {response.status_code}")
        return False
    
    def test_opportunities_endpoint(self):
        """Test job opportunities endpoint"""
        success, response = self.make_request("GET", "/opportunities", auth=False)
        
        if not success:
            self.log_test("Get Opportunities", False, response)
            return False
            
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list) and len(data) > 0:
                job = data[0]
                if "job_id" in job and "title" in job and "company_name" in job:
                    self.log_test("Get Opportunities", True, f"Retrieved {len(data)} job opportunities")
                    return True
                    
        self.log_test("Get Opportunities", False, f"Status: {response.status_code}")
        return False
    
    def test_job_application(self):
        """Test job application"""
        application_data = {
            "cover_letter": "I am very interested in this position and believe my skills align well with the requirements.",
            "resume_url": "https://example.com/resume.pdf"
        }
        
        success, response = self.make_request("POST", "/opportunities/1/apply", application_data)
        
        if not success:
            self.log_test("Job Application", False, response)
            return False
            
        if response.status_code == 200:
            data = response.json()
            if "message" in data and "application_id" in data:
                self.log_test("Job Application", True, f"Application submitted: {data['application_id']}")
                return True
                
        self.log_test("Job Application", False, f"Status: {response.status_code}")
        return False
    
    def test_chat_endpoints(self):
        """Test chat functionality"""
        # Test getting chats
        success, response = self.make_request("GET", "/chats")
        
        if not success:
            self.log_test("Get Chats", False, response)
            return False
            
        if response.status_code == 200:
            chats = response.json()
            self.log_test("Get Chats", True, f"Retrieved {len(chats)} chats")
            
            # Test creating a chat
            chat_data = {
                "name": "Study Group - React Development",
                "type": "group",
                "participants": ["user-123", "user-456"]
            }
            
            success, response = self.make_request("POST", "/chats", chat_data)
            
            if success and response.status_code == 200:
                data = response.json()
                if "message" in data and "chat" in data:
                    self.log_test("Create Chat", True, "Chat room created successfully")
                    return True
                    
        self.log_test("Chat Endpoints", False, f"Status: {response.status_code}")
        return False
    
    def test_analytics_endpoints(self):
        """Test analytics endpoints"""
        # Test learning analytics
        success, response = self.make_request("GET", "/analytics/learning")
        
        if not success:
            self.log_test("Learning Analytics", False, response)
            return False
            
        if response.status_code == 200:
            data = response.json()
            if "patterns" in data and "analytics" in data:
                self.log_test("Learning Analytics", True, "Learning analytics retrieved")
                
                # Test progress report
                success, response = self.make_request("GET", "/analytics/progress-report?period=monthly")
                
                if success and response.status_code == 200:
                    self.log_test("Progress Report", True, "Progress report generated")
                    return True
                    
        self.log_test("Analytics Endpoints", False, f"Status: {response.status_code}")
        return False
    
    def test_admin_endpoints(self):
        """Test admin endpoints (may fail due to permissions)"""
        # Test admin stats
        success, response = self.make_request("GET", "/admin/stats")
        
        if not success:
            self.log_test("Admin Stats", False, response)
            return False
            
        if response.status_code == 200:
            self.log_test("Admin Stats", True, "Admin statistics retrieved")
            
            # Test security summary
            success, response = self.make_request("GET", "/admin/security")
            
            if success and response.status_code == 200:
                self.log_test("Admin Security", True, "Security summary retrieved")
                return True
        elif response.status_code == 403:
            self.log_test("Admin Endpoints", True, "Admin access properly restricted (403 Forbidden)")
            return True
            
        self.log_test("Admin Endpoints", False, f"Status: {response.status_code}")
        return False
    
    def test_error_handling(self):
        """Test error handling"""
        # Test invalid endpoint
        success, response = self.make_request("GET", "/invalid-endpoint", auth=False)
        
        if not success:
            self.log_test("Error Handling - Invalid Endpoint", True, "Request properly failed")
        elif response.status_code == 404:
            self.log_test("Error Handling - Invalid Endpoint", True, "404 returned for invalid endpoint")
        else:
            self.log_test("Error Handling - Invalid Endpoint", False, f"Unexpected status: {response.status_code}")
            
        # Test unauthorized access
        success, response = self.make_request("GET", "/auth/me", auth=False)
        
        if not success:
            self.log_test("Error Handling - Unauthorized", True, "Unauthorized request properly rejected")
        elif response.status_code in [401, 403]:
            self.log_test("Error Handling - Unauthorized", True, "Proper authentication required")
        else:
            self.log_test("Error Handling - Unauthorized", False, f"Unexpected status: {response.status_code}")
            
        return True
    
    def run_all_tests(self):
        """Run comprehensive backend tests"""
        print("🚀 Starting ProLAWH Backend API Testing...")
        print(f"Backend URL: {BACKEND_URL}")
        print("=" * 60)
        
        # Core functionality tests
        tests = [
            self.test_health_check,
            self.test_user_login,  # This will handle registration if needed
            self.test_auth_me,
            self.test_dashboard_stats,
            self.test_ai_recommendations,
            self.test_courses_endpoint,
            self.test_course_enrollment,
            self.test_mentors_endpoint,
            self.test_mentorship_request,
            self.test_opportunities_endpoint,
            self.test_job_application,
            self.test_chat_endpoints,
            self.test_analytics_endpoints,
            self.test_admin_endpoints,
            self.test_error_handling
        ]
        
        passed = 0
        total = len(tests)
        
        for test in tests:
            try:
                if test():
                    passed += 1
                time.sleep(0.5)  # Small delay between tests
            except Exception as e:
                self.log_test(test.__name__, False, f"Exception: {str(e)}")
        
        print("\n" + "=" * 60)
        print(f"🏁 Testing Complete: {passed}/{total} tests passed")
        
        if passed == total:
            print("✅ All tests passed! Backend is fully functional.")
        elif passed >= total * 0.8:
            print("⚠️  Most tests passed. Minor issues detected.")
        else:
            print("❌ Multiple test failures. Backend needs attention.")
            
        return passed, total, self.test_results

def main():
    """Main test execution"""
    tester = ProLAWHBackendTester()
    passed, total, results = tester.run_all_tests()
    
    # Print detailed results
    print("\n📊 Detailed Test Results:")
    print("-" * 40)
    
    for result in results:
        status = "✅" if result["success"] else "❌"
        print(f"{status} {result['test']}")
        if result["details"]:
            print(f"   {result['details']}")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)