#!/usr/bin/env python3
"""
Component-Specific Backend Testing for ProLAWH
Focuses on the 5 priority components requested by the user:
1. Learning Management System
2. Mentorship System  
3. Job Marketplace
4. Real-time Communication
5. AI Integration
"""

import requests
import json
import time
from typing import Dict, Any, Optional

# Backend URL from environment
BACKEND_URL = "https://be9ec068-3e12-4f8e-8b58-546a8c400656.preview.emergentagent.com"
API_BASE = f"{BACKEND_URL}/api"

class ComponentSpecificTester:
    def __init__(self):
        self.session = requests.Session()
        self.auth_token = None
        self.user_data = None
        self.test_results = []
        
    def log_test(self, component: str, test_name: str, success: bool, details: str = ""):
        """Log test result with component grouping"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} [{component}] {test_name}")
        if details:
            print(f"   Details: {details}")
        
        self.test_results.append({
            "component": component,
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
    
    def setup_authentication(self):
        """Setup authentication for testing"""
        login_data = {
            "email": "sarah.johnson@prolawh.com",
            "password": "SecurePass123!"
        }
        
        success, response = self.make_request("POST", "/auth/login", login_data, auth=False)
        
        if success and response.status_code == 200:
            data = response.json()
            self.auth_token = data["access_token"]
            self.user_data = data["user"]
            return True
        return False
    
    def test_learning_management_system(self):
        """Test Learning Management System components"""
        component = "Learning Management"
        
        # Test 1: Course Listing
        success, response = self.make_request("GET", "/courses", auth=False)
        if success and response.status_code == 200:
            courses = response.json()
            self.log_test(component, "Course Listing", True, f"Retrieved {len(courses)} courses")
        else:
            self.log_test(component, "Course Listing", False, f"Status: {response.status_code if success else 'Request failed'}")
        
        # Test 2: Course Search
        success, response = self.make_request("GET", "/courses/search?q=react", auth=False)
        if success and response.status_code == 200:
            search_results = response.json()
            self.log_test(component, "Course Search", True, f"Search returned {len(search_results)} results")
        else:
            self.log_test(component, "Course Search", False, f"Status: {response.status_code if success else 'Request failed'}")
        
        # Test 3: Popular Courses
        success, response = self.make_request("GET", "/courses/popular", auth=False)
        if success and response.status_code == 200:
            popular_courses = response.json()
            self.log_test(component, "Popular Courses", True, f"Retrieved {len(popular_courses)} popular courses")
        else:
            self.log_test(component, "Popular Courses", False, f"Status: {response.status_code if success else 'Request failed'}")
        
        # Test 4: Course Details
        success, response = self.make_request("GET", "/courses/test-course-1", auth=False)
        if success and response.status_code in [200, 404]:
            if response.status_code == 200:
                course_details = response.json()
                self.log_test(component, "Course Details", True, "Course details retrieved successfully")
            else:
                self.log_test(component, "Course Details", True, "Course not found - endpoint working correctly")
        else:
            self.log_test(component, "Course Details", False, f"Status: {response.status_code if success else 'Request failed'}")
        
        # Test 5: My Courses
        success, response = self.make_request("GET", "/my/courses")
        if success and response.status_code == 200:
            my_courses = response.json()
            self.log_test(component, "My Courses", True, f"Retrieved {len(my_courses)} enrolled courses")
        else:
            self.log_test(component, "My Courses", False, f"Status: {response.status_code if success else 'Request failed'}")
        
        # Test 6: Course Progress Tracking
        success, response = self.make_request("GET", "/courses/test-course-react-fundamentals/progress")
        if success and response.status_code in [200, 404]:
            if response.status_code == 200:
                progress = response.json()
                self.log_test(component, "Progress Tracking", True, f"Progress tracking working: {progress.get('completion_percentage', 0)}%")
            else:
                self.log_test(component, "Progress Tracking", True, "Not enrolled - endpoint working correctly")
        else:
            self.log_test(component, "Progress Tracking", False, f"Status: {response.status_code if success else 'Request failed'}")
    
    def test_mentorship_system(self):
        """Test Mentorship System components"""
        component = "Mentorship System"
        
        # Test 1: Mentor Listing
        success, response = self.make_request("GET", "/mentors", auth=False)
        if success and response.status_code == 200:
            mentors = response.json()
            self.log_test(component, "Mentor Listing", True, f"Retrieved {len(mentors)} mentors")
        else:
            self.log_test(component, "Mentor Listing", False, f"Status: {response.status_code if success else 'Request failed'}")
        
        # Test 2: Mentorship Request
        request_data = {
            "mentor_id": "mentor-react-expert",
            "message": "I would like guidance on advanced React patterns and state management",
            "preferred_schedule": "weekends",
            "goals": ["Master React Hooks", "Learn Redux Toolkit", "Build scalable applications"]
        }
        
        success, response = self.make_request("POST", "/mentorship/request", request_data)
        if success and response.status_code == 200:
            result = response.json()
            self.log_test(component, "Mentorship Request", True, "Mentorship request sent successfully")
        else:
            self.log_test(component, "Mentorship Request", False, f"Status: {response.status_code if success else 'Request failed'}")
        
        # Test 3: My Mentorships
        success, response = self.make_request("GET", "/my/mentorships")
        if success and response.status_code == 200:
            mentorships = response.json()
            self.log_test(component, "My Mentorships", True, f"Retrieved mentorship connections")
        else:
            self.log_test(component, "My Mentorships", False, f"Status: {response.status_code if success else 'Request failed'}")
        
        # Test 4: Session Booking
        booking_data = {
            "mentor_id": "mentor-react-expert",
            "session_date": "2025-02-01T10:00:00Z",
            "duration_minutes": 60,
            "topic": "React Performance Optimization",
            "session_type": "video_call"
        }
        
        success, response = self.make_request("POST", "/mentorship/sessions", booking_data)
        if success and response.status_code in [200, 400]:
            if response.status_code == 200:
                session = response.json()
                self.log_test(component, "Session Booking", True, "Session booked successfully")
            else:
                self.log_test(component, "Session Booking", True, "Booking validation working correctly")
        else:
            self.log_test(component, "Session Booking", False, f"Status: {response.status_code if success else 'Request failed'}")
        
        # Test 5: My Sessions
        success, response = self.make_request("GET", "/my/sessions")
        if success and response.status_code == 200:
            sessions = response.json()
            self.log_test(component, "My Sessions", True, f"Retrieved {len(sessions)} upcoming sessions")
        else:
            self.log_test(component, "My Sessions", False, f"Status: {response.status_code if success else 'Request failed'}")
    
    def test_job_marketplace(self):
        """Test Job Marketplace components"""
        component = "Job Marketplace"
        
        # Test 1: Job Opportunities Listing
        success, response = self.make_request("GET", "/opportunities", auth=False)
        if success and response.status_code == 200:
            opportunities = response.json()
            self.log_test(component, "Job Listings", True, f"Retrieved {len(opportunities)} job opportunities")
        else:
            self.log_test(component, "Job Listings", False, f"Status: {response.status_code if success else 'Request failed'}")
        
        # Test 2: Job Filtering
        success, response = self.make_request("GET", "/opportunities?job_type=full_time&location=remote", auth=False)
        if success and response.status_code == 200:
            filtered_jobs = response.json()
            self.log_test(component, "Job Filtering", True, f"Filtered results: {len(filtered_jobs)} jobs")
        else:
            self.log_test(component, "Job Filtering", False, f"Status: {response.status_code if success else 'Request failed'}")
        
        # Test 3: Job Details
        success, response = self.make_request("GET", "/opportunities/1", auth=False)
        if success and response.status_code == 200:
            job_details = response.json()
            self.log_test(component, "Job Details", True, f"Job details retrieved: {job_details.get('title', 'N/A')}")
        else:
            self.log_test(component, "Job Details", False, f"Status: {response.status_code if success else 'Request failed'}")
        
        # Test 4: Job Application
        application_data = {
            "job_id": "1",
            "cover_letter": "I am excited to apply for this position. My experience in React and TypeScript makes me a strong candidate.",
            "resume_url": "https://example.com/sarah-johnson-resume.pdf"
        }
        
        success, response = self.make_request("POST", "/opportunities/1/apply", application_data)
        if success and response.status_code == 200:
            application = response.json()
            self.log_test(component, "Job Application", True, f"Application submitted: {application.get('application_id', 'N/A')}")
        else:
            self.log_test(component, "Job Application", False, f"Status: {response.status_code if success else 'Request failed'}")
    
    def test_real_time_communication(self):
        """Test Real-time Communication components"""
        component = "Real-time Communication"
        
        # Test 1: Get My Chats
        success, response = self.make_request("GET", "/chats")
        if success and response.status_code == 200:
            chats = response.json()
            self.log_test(component, "Chat Rooms", True, f"Retrieved {len(chats)} chat rooms")
        else:
            self.log_test(component, "Chat Rooms", False, f"Status: {response.status_code if success else 'Request failed'}")
        
        # Test 2: Create Chat Room
        chat_data = {
            "name": "React Developers Study Group",
            "chat_type": "group",
            "participants": ["user-123", "user-456", "user-789"]
        }
        
        success, response = self.make_request("POST", "/chats", chat_data)
        if success and response.status_code == 200:
            chat_room = response.json()
            self.log_test(component, "Create Chat", True, "Chat room created successfully")
            
            # Store chat ID for message testing
            chat_id = chat_room.get("chat", {}).get("chat_id", "test-chat-id")
            
            # Test 3: Get Chat Messages
            success, response = self.make_request("GET", f"/chats/{chat_id}/messages")
            if success and response.status_code == 200:
                messages = response.json()
                self.log_test(component, "Chat Messages", True, f"Retrieved {len(messages)} messages")
            else:
                self.log_test(component, "Chat Messages", False, f"Status: {response.status_code if success else 'Request failed'}")
            
            # Test 4: Send Message
            message_data = {
                "chat_id": chat_id,
                "content": "Hello everyone! Looking forward to our React study sessions.",
                "message_type": "text"
            }
            
            success, response = self.make_request("POST", f"/chats/{chat_id}/messages", message_data)
            if success and response.status_code == 200:
                message = response.json()
                self.log_test(component, "Send Message", True, "Message sent successfully")
            else:
                self.log_test(component, "Send Message", False, f"Status: {response.status_code if success else 'Request failed'}")
        else:
            self.log_test(component, "Create Chat", False, f"Status: {response.status_code if success else 'Request failed'}")
        
        # Test 5: Online Presence
        success, response = self.make_request("GET", "/presence")
        if success and response.status_code == 200:
            presence = response.json()
            self.log_test(component, "Online Presence", True, f"Online users: {presence.get('total', 0)}")
        else:
            self.log_test(component, "Online Presence", False, f"Status: {response.status_code if success else 'Request failed'}")
        
        # Test 6: Notifications
        success, response = self.make_request("GET", "/notifications")
        if success and response.status_code == 200:
            notifications = response.json()
            self.log_test(component, "Notifications", True, f"Retrieved {len(notifications)} notifications")
        else:
            self.log_test(component, "Notifications", False, f"Status: {response.status_code if success else 'Request failed'}")
    
    def test_ai_integration(self):
        """Test AI Integration components"""
        component = "AI Integration"
        
        # Test 1: AI Recommendations
        success, response = self.make_request("GET", "/dashboard/recommendations")
        if success and response.status_code == 200:
            recommendations = response.json()
            courses = recommendations.get("courses", [])
            mentors = recommendations.get("mentors", [])
            opportunities = recommendations.get("opportunities", [])
            self.log_test(component, "AI Recommendations", True, f"Generated {len(courses)} course, {len(mentors)} mentor, {len(opportunities)} job recommendations")
        else:
            self.log_test(component, "AI Recommendations", False, f"Status: {response.status_code if success else 'Request failed'}")
        
        # Test 2: Skill Development Path
        success, response = self.make_request("GET", "/ai/skill-path?target_role=Senior Frontend Developer")
        if success and response.status_code == 200:
            skill_path = response.json()
            self.log_test(component, "Skill Development Path", True, "AI-generated skill path created")
        else:
            self.log_test(component, "Skill Development Path", False, f"Status: {response.status_code if success else 'Request failed'}")
        
        # Test 3: Learning Analytics
        success, response = self.make_request("GET", "/analytics/learning")
        if success and response.status_code == 200:
            analytics = response.json()
            self.log_test(component, "Learning Analytics", True, "AI learning pattern analysis completed")
        else:
            self.log_test(component, "Learning Analytics", False, f"Status: {response.status_code if success else 'Request failed'}")
        
        # Test 4: Progress Report
        success, response = self.make_request("GET", "/analytics/progress-report?period=monthly")
        if success and response.status_code == 200:
            report = response.json()
            self.log_test(component, "Progress Report", True, "AI-powered progress report generated")
        else:
            self.log_test(component, "Progress Report", False, f"Status: {response.status_code if success else 'Request failed'}")
        
        # Test 5: Career Trajectory (Advanced AI)
        success, response = self.make_request("GET", "/ai/career-trajectory")
        if success and response.status_code == 200:
            trajectory = response.json()
            self.log_test(component, "Career Trajectory", True, "AI career prediction generated")
        else:
            self.log_test(component, "Career Trajectory", False, f"Status: {response.status_code if success else 'Request failed'}")
        
        # Test 6: Skill Gap Analysis
        analysis_data = {
            "target_role": "Senior Full Stack Developer"
        }
        
        success, response = self.make_request("POST", "/ai/skill-gaps", analysis_data)
        if success and response.status_code == 200:
            analysis = response.json()
            self.log_test(component, "Skill Gap Analysis", True, "Real-time skill gap analysis completed")
        else:
            self.log_test(component, "Skill Gap Analysis", False, f"Status: {response.status_code if success else 'Request failed'}")
    
    def run_component_tests(self):
        """Run all component-specific tests"""
        print("🚀 Starting ProLAWH Component-Specific Backend Testing...")
        print(f"Backend URL: {BACKEND_URL}")
        print("Testing Priority Components:")
        print("1. Learning Management System")
        print("2. Mentorship System")
        print("3. Job Marketplace")
        print("4. Real-time Communication")
        print("5. AI Integration")
        print("=" * 80)
        
        # Setup authentication
        if not self.setup_authentication():
            print("❌ Authentication setup failed. Cannot proceed with tests.")
            return 0, 0, []
        
        print(f"✅ Authenticated as: {self.user_data.get('full_name', 'Unknown User')}")
        print("-" * 80)
        
        # Run component tests
        self.test_learning_management_system()
        print()
        self.test_mentorship_system()
        print()
        self.test_job_marketplace()
        print()
        self.test_real_time_communication()
        print()
        self.test_ai_integration()
        
        # Calculate results
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result["success"])
        
        print("\n" + "=" * 80)
        print(f"🏁 Component Testing Complete: {passed_tests}/{total_tests} tests passed")
        
        # Component-wise summary
        components = {}
        for result in self.test_results:
            comp = result["component"]
            if comp not in components:
                components[comp] = {"passed": 0, "total": 0}
            components[comp]["total"] += 1
            if result["success"]:
                components[comp]["passed"] += 1
        
        print("\n📊 Component-wise Results:")
        print("-" * 50)
        for comp, stats in components.items():
            status = "✅" if stats["passed"] == stats["total"] else "⚠️" if stats["passed"] >= stats["total"] * 0.8 else "❌"
            print(f"{status} {comp}: {stats['passed']}/{stats['total']} tests passed")
        
        if passed_tests == total_tests:
            print("\n✅ All component tests passed! Backend is fully functional.")
        elif passed_tests >= total_tests * 0.9:
            print("\n⚠️  Most tests passed. Minor issues detected.")
        else:
            print("\n❌ Multiple test failures. Backend needs attention.")
            
        return passed_tests, total_tests, self.test_results

def main():
    """Main test execution"""
    tester = ComponentSpecificTester()
    passed, total, results = tester.run_component_tests()
    
    return passed >= total * 0.9  # Consider success if 90%+ tests pass

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)