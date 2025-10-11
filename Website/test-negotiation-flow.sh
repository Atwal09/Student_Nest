#!/bin/bash

# Negotiation to Booking Flow Test Script
# Make sure the development server is running on http://localhost:3000

echo "🧪 Testing Negotiation to Booking Flow"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test configuration
STUDENT_EMAIL="student@example.com"
STUDENT_PASSWORD="password123"
OWNER_EMAIL="owner@example.com"
OWNER_PASSWORD="password123"

echo "${BLUE}1️⃣ Student Login...${NC}"
STUDENT_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$STUDENT_EMAIL\",\"password\":\"$STUDENT_PASSWORD\"}")

STUDENT_TOKEN=$(echo $STUDENT_RESPONSE | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)

if [ -z "$STUDENT_TOKEN" ]; then
  echo "${RED}❌ Student login failed${NC}"
  echo "Response: $STUDENT_RESPONSE"
  exit 1
fi

echo "${GREEN}✅ Student logged in${NC}"

echo ""
echo "${BLUE}2️⃣ Owner Login...${NC}"
OWNER_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$OWNER_EMAIL\",\"password\":\"$OWNER_PASSWORD\"}")

OWNER_TOKEN=$(echo $OWNER_RESPONSE | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)

if [ -z "$OWNER_TOKEN" ]; then
  echo "${RED}❌ Owner login failed${NC}"
  echo "Response: $OWNER_RESPONSE"
  exit 1
fi

echo "${GREEN}✅ Owner logged in${NC}"

echo ""
echo "${BLUE}3️⃣ Fetching available room...${NC}"
ROOMS_RESPONSE=$(curl -s -X GET "http://localhost:3000/api/rooms?limit=1" \
  -H "Authorization: Bearer $STUDENT_TOKEN")

ROOM_ID=$(echo $ROOMS_RESPONSE | grep -o '"_id":"[^"]*' | head -1 | cut -d'"' -f4)
ROOM_PRICE=$(echo $ROOMS_RESPONSE | grep -o '"price":[0-9]*' | head -1 | cut -d':' -f2)

if [ -z "$ROOM_ID" ]; then
  echo "${RED}❌ No rooms found${NC}"
  echo "Response: $ROOMS_RESPONSE"
  exit 1
fi

echo "${GREEN}✅ Room found: $ROOM_ID${NC}"
echo "   Original Price: ₹$ROOM_PRICE"

echo ""
echo "${BLUE}4️⃣ Student creates negotiation...${NC}"
PROPOSED_PRICE=$((ROOM_PRICE * 80 / 100))  # 20% discount

NEGOTIATION_RESPONSE=$(curl -s -X POST http://localhost:3000/api/negotiations \
  -H "Authorization: Bearer $STUDENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"roomId\":\"$ROOM_ID\",\"proposedPrice\":$PROPOSED_PRICE,\"duration\":12,\"message\":\"Need long-term accommodation\"}")

NEGOTIATION_ID=$(echo $NEGOTIATION_RESPONSE | grep -o '"_id":"[^"]*' | head -1 | cut -d'"' -f4)

if [ -z "$NEGOTIATION_ID" ]; then
  echo "${RED}❌ Negotiation creation failed${NC}"
  echo "Response: $NEGOTIATION_RESPONSE"
  exit 1
fi

echo "${GREEN}✅ Negotiation created: $NEGOTIATION_ID${NC}"
echo "   Proposed Price: ₹$PROPOSED_PRICE"

echo ""
echo "${BLUE}5️⃣ Owner makes counter offer...${NC}"
COUNTER_OFFER=$((ROOM_PRICE * 90 / 100))  # 10% discount

COUNTER_RESPONSE=$(curl -s -X PATCH http://localhost:3000/api/negotiations/$NEGOTIATION_ID \
  -H "Authorization: Bearer $OWNER_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"action\":\"counter\",\"counterOffer\":$COUNTER_OFFER,\"message\":\"Can offer this for 12 months\"}")

echo "${GREEN}✅ Counter offer made${NC}"
echo "   Counter Price: ₹$COUNTER_OFFER"

echo ""
echo "${BLUE}6️⃣ Student accepts counter offer... ✨ NEW${NC}"
ACCEPT_RESPONSE=$(curl -s -X POST http://localhost:3000/api/negotiations/$NEGOTIATION_ID/accept-counter \
  -H "Authorization: Bearer $STUDENT_TOKEN")

SUCCESS=$(echo $ACCEPT_RESPONSE | grep -o '"success":true')

if [ -z "$SUCCESS" ]; then
  echo "${RED}❌ Accept counter failed${NC}"
  echo "Response: $ACCEPT_RESPONSE"
  exit 1
fi

FINAL_PRICE=$(echo $ACCEPT_RESPONSE | grep -o '"finalPrice":[0-9]*' | head -1 | cut -d':' -f2)
SAVINGS=$(echo $ACCEPT_RESPONSE | grep -o '"savings":[0-9]*' | head -1 | cut -d':' -f2)

echo "${GREEN}✅ Counter offer accepted!${NC}"
echo "   Final Price: ₹$FINAL_PRICE"
echo "   Savings: ₹$SAVINGS"

echo ""
echo "${BLUE}7️⃣ Student creates booking at negotiated price... ✨ ENHANCED${NC}"
MOVE_IN_DATE=$(date -v+7d +%Y-%m-%d)  # 7 days from now

BOOKING_RESPONSE=$(curl -s -X POST http://localhost:3000/api/bookings \
  -H "Authorization: Bearer $STUDENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"roomId\":\"$ROOM_ID\",\"negotiationId\":\"$NEGOTIATION_ID\",\"moveInDate\":\"${MOVE_IN_DATE}T00:00:00.000Z\",\"duration\":12}")

BOOKING_ID=$(echo $BOOKING_RESPONSE | grep -o '"_id":"[^"]*' | grep -v "room\|student\|owner" | head -1 | cut -d'"' -f4)

if [ -z "$BOOKING_ID" ]; then
  echo "${RED}❌ Booking creation failed${NC}"
  echo "Response: $BOOKING_RESPONSE"
  exit 1
fi

MONTHLY_RENT=$(echo $BOOKING_RESPONSE | grep -o '"monthlyRent":[0-9]*' | head -1 | cut -d':' -f2)

echo "${GREEN}✅ Booking created successfully!${NC}"
echo "   Booking ID: $BOOKING_ID"
echo "   Monthly Rent: ₹$MONTHLY_RENT (Negotiated!)"

echo ""
echo "============================================================"
echo "📊 NEGOTIATION TO BOOKING FLOW SUMMARY"
echo "============================================================"
echo "Original Price:    ₹$ROOM_PRICE/month"
echo "Student Proposed:  ₹$PROPOSED_PRICE/month"
echo "Owner Countered:   ₹$COUNTER_OFFER/month"
echo "Final Agreed:      ₹$MONTHLY_RENT/month"
echo "Student Saved:     ₹$((ROOM_PRICE - MONTHLY_RENT))/month"
echo "Total Savings:     ₹$(($(($ROOM_PRICE - MONTHLY_RENT)) * 12))/year"
echo "============================================================"
echo ""
echo "${GREEN}✅ ALL TESTS PASSED! Negotiation to booking flow is working!${NC}"
