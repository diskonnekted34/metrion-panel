import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import PublicNav from "@/components/PublicNav";
import { retrievePlan } from "@/lib/checkoutMachine";
import { plans } from "@/config/plans";

const CheckoutSuccess = () => {
  const planId = retrievePlan();
  const plan = plans.find((p) => p.id === planId);

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      <div className="pt-32 pb-24 px-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-success/10 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-success" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">You're all set!</h1>
          <p className="text-sm text-muted-foreground mb-2">
            Your <span className="font-semibold text-foreground">{plan?.name ?? "plan"}</span> trial is now active.
          </p>
          <p className="text-xs text-muted-foreground mb-8">
            We've sent a confirmation to your email. Your 14-day free trial starts today.
          </p>

          <div className="flex flex-col gap-3">
            <Link
              to="/dashboard"
              className="w-full py-3.5 rounded-2xl text-sm font-medium btn-primary text-center"
            >
              Go to dashboard
            </Link>
            <Link
              to="/"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Back to home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
