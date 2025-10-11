"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import RazorpayCheckout from '@/components/payments/RazorpayCheckout';
import {
  CreditCard,
  Banknote,
  CheckCircle,
  Clock,
  AlertTriangle,
  Info,
  MapPin,
  Calendar,
  DollarSign,
  Home
} from 'lucide-react';
import { toast } from 'sonner';
import apiClient from '@/lib/api';

interface BookingCardProps {
  booking: {
    id: string;
    roomTitle: string;
    roomAddress: string;
    roomImage?: string;
    monthlyRent: number;
    securityDeposit: number;
    totalAmount: number;
    moveInDate: string;
    moveOutDate?: string;
    duration: number;
    status: string;
    paymentStatus: string;
    paymentMethod?: string;
    transactionId?: string;
    ownerName?: string;
    ownerPhone?: string;
    roomId: string;
    propertyId?: string;
  };
  onPaymentSuccess?: () => void;
  onStatusChange?: () => void;
}

export default function BookingPaymentCard({ booking, onPaymentSuccess, onStatusChange }: BookingCardProps) {
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'offline'>('online');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);

  // Check if payment is required
  const isPaymentPending = booking.paymentStatus === 'pending' && booking.status === 'pending';
  const isPaymentPaid = booking.paymentStatus === 'paid';
  const isBookingConfirmed = booking.status === 'confirmed' || booking.status === 'active';

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle online payment success
  const handleOnlinePaymentSuccess = async (response: any) => {
    setIsProcessing(true);
    try {
      // Update booking with payment details
      const updateResponse = await apiClient.request('/api/bookings/' + booking.id, {
        method: 'PATCH',
        body: JSON.stringify({
          paymentStatus: 'paid',
          status: 'confirmed', // Auto-confirm on successful online payment
          paymentDetails: {
            paymentMethod: 'online',
            transactionId: response.razorpay_payment_id,
            paymentDate: new Date(),
            totalPaid: booking.totalAmount,
            securityDepositPaid: booking.securityDeposit,
            firstMonthRentPaid: booking.monthlyRent,
          },
        }),
      });

      if (updateResponse.success) {
        toast.success('Payment successful! Your booking is confirmed automatically.');
        onPaymentSuccess?.();
        onStatusChange?.();
      } else {
        toast.error('Payment recorded but booking update failed. Please contact support.');
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Payment successful but failed to update booking. Please contact support.');
    } finally {
      setIsProcessing(false);
      setShowPaymentOptions(false);
    }
  };

  // Handle offline payment request
  const handleOfflinePayment = async () => {
    setIsProcessing(true);
    try {
      const response = await apiClient.request('/api/bookings/' + booking.id, {
        method: 'PATCH',
        body: JSON.stringify({
          paymentStatus: 'pending',
          status: 'pending', // Remains pending until owner confirms
          paymentDetails: {
            paymentMethod: 'offline',
            paymentDate: new Date(),
          },
          studentNotes: 'Student has chosen offline payment method. Awaiting payment confirmation from both parties.',
        }),
      });

      if (response.success) {
        toast.success(
          'Offline payment selected. Please contact the owner to arrange payment. Booking will be confirmed after both parties verify payment.',
          { duration: 6000 }
        );
        onStatusChange?.();
      } else {
        toast.error(response.error || 'Failed to update payment method');
      }
    } catch (error) {
      console.error('Error selecting offline payment:', error);
      toast.error('Failed to select offline payment');
    } finally {
      setIsProcessing(false);
      setShowPaymentOptions(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-xl flex items-center gap-2">
              <Home className="h-5 w-5" />
              {booking.roomTitle}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{booking.roomAddress}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className={getStatusBadge(booking.status)}>
              {booking.status}
            </Badge>
            <Badge variant={isPaymentPaid ? 'default' : 'secondary'}>
              {booking.paymentStatus === 'paid' ? (
                <><CheckCircle className="h-3 w-3 mr-1" /> Paid</>
              ) : (
                <><Clock className="h-3 w-3 mr-1" /> Payment Pending</>
              )}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Booking Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" /> Move-in Date
            </p>
            <p className="font-medium">{formatDate(booking.moveInDate)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Duration</p>
            <p className="font-medium">{booking.duration} months</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <DollarSign className="h-3 w-3" /> Monthly Rent
            </p>
            <p className="font-medium text-green-600">₹{booking.monthlyRent.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="font-medium text-blue-600">₹{booking.totalAmount.toLocaleString()}</p>
          </div>
        </div>

        {/* Payment Information */}
        {booking.paymentMethod && (
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">Payment Information</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Method:</span>
                <span className="ml-2 capitalize">{booking.paymentMethod}</span>
              </div>
              {booking.transactionId && (
                <div>
                  <span className="text-muted-foreground">Transaction ID:</span>
                  <span className="ml-2 font-mono text-xs">{booking.transactionId}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Payment Action Section */}
        {isPaymentPending && !showPaymentOptions && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Complete your payment to confirm this booking. Choose between instant online payment or offline payment arrangement with the owner.
            </AlertDescription>
          </Alert>
        )}

        {isPaymentPending && !showPaymentOptions && (
          <Button
            className="w-full"
            size="lg"
            onClick={() => setShowPaymentOptions(true)}
          >
            <CreditCard className="h-5 w-5 mr-2" />
            Choose Payment Method
          </Button>
        )}

        {/* Payment Options */}
        {showPaymentOptions && isPaymentPending && (
          <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
            <h4 className="font-semibold">Select Payment Method</h4>

            <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as 'online' | 'offline')}>
              <div className="space-y-4">
                {/* Online Payment Option */}
                <div className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${paymentMethod === 'online' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                  }`}>
                  <RadioGroupItem value="online" id="online" />
                  <div className="flex-1">
                    <Label htmlFor="online" className="cursor-pointer">
                      <div className="flex items-center gap-2 font-semibold">
                        <CreditCard className="h-5 w-5 text-primary" />
                        Online Payment (Recommended)
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Pay instantly with UPI, Card, or Net Banking. Your booking will be <strong>automatically confirmed</strong> upon successful payment.
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" /> Instant Confirmation
                        </Badge>
                        <Badge variant="secondary" className="text-xs">Secure Payment</Badge>
                      </div>
                    </Label>
                  </div>
                </div>

                {/* Offline Payment Option */}
                <div className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${paymentMethod === 'offline' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                  }`}>
                  <RadioGroupItem value="offline" id="offline" />
                  <div className="flex-1">
                    <Label htmlFor="offline" className="cursor-pointer">
                      <div className="flex items-center gap-2 font-semibold">
                        <Banknote className="h-5 w-5 text-orange-500" />
                        Offline Payment
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Pay directly to the owner via cash, bank transfer, or UPI. Booking requires <strong>confirmation from both you and the owner</strong> after payment.
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" /> Awaits Confirmation
                        </Badge>
                        {booking.ownerPhone && (
                          <span className="text-xs text-muted-foreground">
                            Contact: {booking.ownerPhone}
                          </span>
                        )}
                      </div>
                    </Label>
                  </div>
                </div>
              </div>
            </RadioGroup>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowPaymentOptions(false)}
                className="flex-1"
              >
                Cancel
              </Button>

              {paymentMethod === 'online' ? (
                <div className="flex-1">
                  <RazorpayCheckout
                    amount={booking.totalAmount}
                    bookingId={booking.id}
                    propertyId={booking.propertyId || booking.roomId}
                    description={`Booking payment for ${booking.roomTitle}`}
                    buttonText="Pay Now"
                    onSuccess={handleOnlinePaymentSuccess}
                    onFailure={(error) => {
                      console.error('Payment failed:', error);
                      toast.error('Payment failed. Please try again.');
                    }}
                  />
                </div>
              ) : (
                <Button
                  onClick={handleOfflinePayment}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  {isProcessing ? 'Processing...' : 'Choose Offline Payment'}
                </Button>
              )}
            </div>

            {/* Info Alert */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription className="text-xs">
                {paymentMethod === 'online' ? (
                  <>
                    <strong>Online Payment:</strong> Your booking will be automatically confirmed upon successful payment. No manual verification required.
                  </>
                ) : (
                  <>
                    <strong>Offline Payment:</strong> After selecting this option, contact the owner at <strong>{booking.ownerPhone || 'the provided number'}</strong> to arrange payment. Both you and the owner must confirm the payment for booking confirmation.
                  </>
                )}
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Confirmed Booking Message */}
        {isBookingConfirmed && isPaymentPaid && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>Booking Confirmed!</strong> Your payment has been received and your booking is confirmed. You can move in on {formatDate(booking.moveInDate)}.
            </AlertDescription>
          </Alert>
        )}

        {/* Pending Offline Payment Message */}
        {booking.paymentMethod === 'offline' && !isPaymentPaid && (
          <Alert className="bg-orange-50 border-orange-200">
            <Clock className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Offline Payment Selected:</strong> Please contact the owner at <strong>{booking.ownerPhone || 'the provided number'}</strong> to complete the payment. The booking will be confirmed after both parties verify the payment.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
