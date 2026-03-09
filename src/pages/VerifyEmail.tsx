import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const VerifyEmail = () => (
  <div className="min-h-screen bg-background flex items-center justify-center p-4">
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md text-center"
    >
      <Link to="/" className="block mb-10">
        <span
          className="text-3xl font-semibold text-foreground"
          style={{ letterSpacing: "-0.04em", fontFamily: "'Helvetica Neue', Helvetica, Arial, system-ui, sans-serif" }}
        >
          Metrion<sup className="text-[9px] font-normal" style={{ verticalAlign: "super" }}>®</sup>
        </span>
      </Link>

      <div className="rounded-2xl border border-border bg-card p-8">
        <MailCheck className="w-14 h-14 text-primary mx-auto mb-4" />
        <h1 className="text-xl font-semibold text-foreground mb-2">Verify your email</h1>
        <p className="text-sm text-muted-foreground mb-6">
          We sent a verification link to your inbox. Click the link to activate your account.
        </p>
        <Button asChild className="w-full">
          <Link to="/login">Continue to sign in</Link>
        </Button>
      </div>
    </motion.div>
  </div>
);

export default VerifyEmail;
