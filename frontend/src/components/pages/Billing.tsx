import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

interface Plan {
  name: string;
  price: number;
  features: string[];
  current: boolean;
  recommended?: boolean;
}

export default function Billing() {
  const { user } = useAuth();

  const plans: Plan[] = [
    {
      name: 'Free',
      price: 0,
      features: [
        'Up to 10 invoices per month',
        'Basic AI processing',
        'Standard support',
        'PDF export',
        'Email sending'
      ],
      current: user?.plan === 'free'
    },
    {
      name: 'Pro',
      price: 10,
      features: [
        'Unlimited invoices',
        'Advanced AI processing',
        'Priority support',
        'Custom branding',
        'API access',
        'Team collaboration',
        'Advanced analytics'
      ],
      current: user?.plan === 'pro',
      recommended: true
    },
    {
      name: 'Enterprise',
      price: 25,
      features: [
        'Everything in Pro',
        'Dedicated account manager',
        'Custom integrations',
        'SLA guarantee',
        'On-premise deployment',
        'White-label solution',
        'Custom training'
      ],
      current: user?.plan === 'enterprise'
    }
  ];

  const handleUpgrade = (planName: string) => {
    toast.success('Upgrade Initiated', {
      description: `Redirecting to checkout for ${planName} plan...`
    });
  };

  return (
    <div className="p-8 space-y-8 bg-[#f8fafc] min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1e293b] mb-2">Billing & Plans</h1>
        <p className="text-[#64748b]">
          Choose the plan that works best for your business
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <Card
            key={index}
            className={`relative ${
              plan.current ? 'border-2 border-[#2563eb]' : ''
            } ${plan.recommended ? 'shadow-xl' : ''}`}
          >
            {plan.recommended && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-[#7c3aed] hover:bg-[#7c3aed]">
                  Recommended
                </Badge>
              </div>
            )}
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
              <div className="text-4xl font-bold">
                ${plan.price}
                <span className="text-lg text-[#64748b]">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-[#64748b]">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {plan.current ? (
                <Button className="w-full" variant="outline" disabled>
                  Current Plan
                </Button>
              ) : (
                <Button
                  className="w-full bg-[#2563eb] hover:bg-[#1d4ed8]"
                  onClick={() => handleUpgrade(plan.name)}
                >
                  Upgrade to {plan.name}
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Usage Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-[#64748b] mb-1">Current Plan</p>
              <p className="text-[#1e293b] font-medium">
                {user?.plan ? user.plan.charAt(0).toUpperCase() + user.plan.slice(1) : 'Free'}
              </p>
            </div>
            <div>
              <p className="text-[#64748b] mb-1">Invoices This Month</p>
              <p className="text-[#1e293b] font-medium">
                {user?.invoicesCount || 0} / {user?.plan === 'free' ? '10' : 'Unlimited'}
              </p>
            </div>
            <div>
              <p className="text-[#64748b] mb-1">Next Billing Date</p>
              <p className="text-[#1e293b] font-medium">November 9, 2025</p>
            </div>
            <div>
              <p className="text-[#64748b] mb-1">Status</p>
              <Badge className="bg-emerald-500 hover:bg-emerald-500">Active</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}