import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle } from "lucide-react";

const ForgotPassword = () => {
  const { requestReset } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await requestReset(email);
      setSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Link to="/" className="block text-center mb-10">
          <span
            className="text-3xl font-semibold text-foreground"
            style={{ letterSpacing: "-0.04em", fontFamily: "'Helvetica Neue', Helvetica, Arial, system-ui, sans-serif" }}
          >
            Metrion<sup className="text-[9px] font-normal" style={{ verticalAlign: "super" }}>®</sup>
          </span>
        </Link>

        <div className="rounded-2xl border border-border bg-card p-8">
          {sent ? (
            <div className="text-center py-4">
              <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
              <h1 className="text-xl font-semibold text-foreground mb-2">Check your email</h1>
              <p className="text-sm text-muted-foreground mb-6">
                We sent a reset link to <span className="text-foreground">{email}</span>
              </p>
              <Link to="/login" className="text-sm text-primary hover:underline">
                Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-xl font-semibold text-foreground mb-1">Reset password</h1>
              <p className="text-sm text-muted-foreground mb-6">
                Enter your email and we'll send a reset link
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Sending…" : "Send reset link"}
                </Button>
              </form>

              <Link
                to="/login"
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mt-6 justify-center"
              >
                <ArrowLeft className="w-3 h-3" /> Back to sign in
              </Link>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
