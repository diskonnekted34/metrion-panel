import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { XCircle } from "lucide-react";
import PublicNav from "@/components/PublicNav";

const CheckoutFailure = () => (
  <div className="min-h-screen bg-background">
    <PublicNav />
    <div className="pt-32 pb-24 px-6 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center"
      >
        <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
          <XCircle className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Payment failed</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Something went wrong processing your payment. Please try again or contact support.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            to="/checkout"
            className="w-full py-3.5 rounded-2xl text-sm font-medium btn-primary text-center"
          >
            Try again
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

export default CheckoutFailure;
