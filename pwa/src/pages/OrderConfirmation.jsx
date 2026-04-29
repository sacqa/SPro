import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

export default function OrderConfirmation() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { state } = useLocation();
  const { order, whatsappUrl } = state || {};
  const redirected = useRef(false);

  useEffect(() => {
    if (whatsappUrl && !redirected.current) {
      redirected.current = true;
      // Open WhatsApp after short delay
      setTimeout(() => window.open(whatsappUrl, '_blank'), 1500);
    }
  }, [whatsappUrl]);

  if (!order) return <div className="p-6 text-center">Order not found</div>;

  return (
    <div className="px-4 py-8 max-w-md mx-auto text-center">
      <div className="text-6xl mb-4 animate-bounce">✅</div>
      <h1 className="text-2xl font-bold text-green-600">Order Placed!</h1>
      <p className="text-gray-500 mt-2">Order #{order.orderNumber}</p>
      <div className="card p-4 mt-6 text-left">
        <div className="text-sm space-y-2">
          <div className="flex justify-between"><span className="text-gray-500">Status</span><span className="text-amber-600 font-medium">Submitted</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Total</span><span className="font-bold text-primary">Rs. {order.totalAmount}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Payment</span><span>{order.paymentMethod}</span></div>
        </div>
      </div>
      <div className="bg-green-50 rounded-card p-4 mt-4 text-sm text-green-700">
        📱 WhatsApp is opening with your order details. Please send the message to confirm your order.
      </div>
      <div className="mt-6 space-y-3">
        <button onClick={() => window.open(whatsappUrl, '_blank')} className="w-full bg-green-500 text-white font-semibold py-3 rounded-card flex items-center justify-center gap-2">
          <span>💬</span> Send via WhatsApp
        </button>
        <button onClick={() => navigate(`/payment-proof/${order.id}`)} className="w-full btn-primary py-3">
          📸 Upload Payment Proof
        </button>
        <button onClick={() => navigate('/orders')} className="w-full btn-outline py-3">View My Orders</button>
      </div>
    </div>
  );
}
