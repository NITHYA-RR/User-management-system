import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserCircle, Shield, Database } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-primary mb-6 shadow-elegant">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            User Management System
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A complete full-stack solution with premium UI, JWT authentication, and comprehensive CRUD operations
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-card p-8 rounded-2xl shadow-soft border border-border hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <UserCircle className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">User Registration</h3>
            <p className="text-muted-foreground">
              Comprehensive registration with validation, image upload, and encrypted passwords
            </p>
          </div>

          <div className="bg-card p-8 rounded-2xl shadow-soft border border-border hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-2">JWT Authentication</h3>
            <p className="text-muted-foreground">
              Secure authentication with access and refresh tokens, role-based access control
            </p>
          </div>

          <div className="bg-card p-8 rounded-2xl shadow-soft border border-border hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Database className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Admin Dashboard</h3>
            <p className="text-muted-foreground">
              Modern admin panel with search, filter, and complete CRUD operations
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg"
            className="bg-gradient-primary hover:opacity-90 text-white shadow-elegant transition-all duration-300 hover:shadow-lg hover:scale-105"
            onClick={() => navigate("/login")}
          >
            Login to Dashboard
          </Button>
          <Button 
            size="lg"
            variant="outline"
            className="border-2 hover:bg-secondary transition-all duration-300"
            onClick={() => navigate("/register")}
          >
            Create Account
          </Button>
        </div>

        {/* Tech Stack */}
        <div className="mt-20 text-center">
          <p className="text-sm text-muted-foreground mb-4">Built with modern technologies</p>
          <div className="flex flex-wrap justify-center gap-4">
            {["React", "Express.js", "JWT", "bcrypt", "Tailwind CSS"].map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 bg-muted rounded-full text-sm font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
