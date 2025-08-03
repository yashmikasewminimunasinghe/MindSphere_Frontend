import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => (
  <div className="p-8 text-center text-red-600">
    <h1 className="text-3xl font-bold mb-4">Unauthorized Access</h1>
    <p>You do not have permission to view this page.</p>
    <Link to="/login" className="mt-4 inline-block text-blue-500 underline">
      Back to Login
    </Link>
  </div>
);

export default Unauthorized;
