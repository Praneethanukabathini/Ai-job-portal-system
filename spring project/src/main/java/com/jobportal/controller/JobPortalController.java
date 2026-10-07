package com.jobportal.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import jakarta.servlet.http.HttpSession;

@Controller
public class JobPortalController {

    /**
     * Home Page with AI Job Recommendation, Search & Category Filters
     */
    @GetMapping({"/", "/home"})
    public String home(Model model) {
        model.addAttribute("pageTitle", "AI Job Portal - Find Your Dream Job with AI");
        return "index";
    }

    /**
     * Dedicated Login Page
     */
    @GetMapping("/login")
    public String login(@RequestParam(value = "role", defaultValue = "candidate") String role, 
                        @RequestParam(value = "logout", required = false) String logout,
                        Model model) {
        model.addAttribute("defaultRole", role);
        if (logout != null) {
            model.addAttribute("logoutMessage", "You have been logged out successfully.");
        }
        return "login";
    }

    /**
     * Candidate & Recruiter Dashboard
     */
    @GetMapping("/dashboard")
    public String dashboard(Model model, HttpSession session) {
        model.addAttribute("pageTitle", "Dashboard | AI Job Portal");
        return "dashboard";
    }

    /**
     * Interactive AI Resume Builder
     */
    @GetMapping("/resume-builder")
    public String resumeBuilder(Model model) {
        model.addAttribute("pageTitle", "AI Resume Builder & PDF Preview");
        return "resume-builder";
    }

    /**
     * Logout Handler
     */
    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/login?logout=true";
    }
}
