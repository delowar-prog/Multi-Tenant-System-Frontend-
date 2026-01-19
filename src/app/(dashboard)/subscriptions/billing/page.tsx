"use client";
import { useEffect, useState } from 'react'
import { api } from 'src/lib/api';
import { Crown, Star, Zap, CheckCircle } from 'lucide-react';

interface Plan {
  id: number,
  name: string,
  price: string,
  billing_cycle: string,
  trial_days: number,
}
export default function BillingPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(false)


  useEffect(() => {
    api.get('/plans').then(res => {
      setPlans(res.data.data)
    })
  }, [])

  const subscribe = async (planId:number) => {
    setLoading(true)
    try {
      const res=await api.post(`/payments/sslcommerz/initiate`,{
        plan_id:planId
      })
      window.location.href = res.data.payment_url
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-800">
          Choose the right plan for your business
        </h1>
        <p className="mt-4 text-gray-800">
          Start with a free trial. Upgrade anytime. No hidden fees.
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => {
            const IconComponent = [Star, Crown, Zap][index % 3];
            const features = [
              ["Basic support", "1GB storage", "5 users"],
              ["Priority support", "10GB storage", "Unlimited users"],
              ["24/7 support", "Unlimited storage", "Advanced analytics"]
            ];
            return (
              <div
                key={plan.id}
                className="relative bg-gray-50 rounded-2xl border border-gray-700 p-8 shadow-sm hover:shadow-md transition hover:scale-105"
              >
                <div className="flex items-center justify-center mb-4">
                  <IconComponent className="w-8 h-8 text-yellow-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700">
                  {plan.name}
                </h3>

                <div className="mt-6">
                  <span className="text-4xl font-bold text-gray-700">
                    ৳{plan.price}
                  </span>
                  <span className="text-gray-700">
                    {" "} / {plan.billing_cycle}
                  </span>
                </div>

                {plan.trial_days && (
                  <p className="mt-2 text-sm text-green-400">
                    {plan.trial_days} days free trial
                  </p>
                )}

                <ul className="mt-6 space-y-2">
                  {features[index % features.length].map(feature => (
                    <li key={feature} className="flex items-center text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  disabled={loading}
                  onClick={() => subscribe(plan.id)}
                  className="mt-8 w-full py-3 rounded-xl font-medium bg-indigo-600 text-white hover:bg-indigo-500 transition-all duration-200 hover:scale-105"
                >
                  {loading ? "Processing..." : "Pay with SSLCommerz"}
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-16 bg-gray-50 rounded-2xl p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-700 mb-6">Billing History</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-gray-700 border-b border-gray-700 pb-2">
              <span>Basic Plan - January 2023</span>
              <span>৳10.00</span>
            </div>
            <div className="flex justify-between items-center text-gray-700 border-b border-gray-700 pb-2">
              <span>Premium Plan - February 2023</span>
              <span>৳25.00</span>
            </div>
            <div className="flex justify-between items-center text-gray-700">
              <span>Pro Plan - March 2023</span>
              <span>৳50.00</span>
            </div>
          </div>
        </div>

        <p className="mt-10 text-sm text-gray-400">
          Need help? <span className="text-indigo-400 cursor-pointer hover:text-indigo-300">Contact sales</span>
        </p>
      </div>
    </div>
  )
}
