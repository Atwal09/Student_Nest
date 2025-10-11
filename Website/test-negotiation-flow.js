// Test complete negotiation to booking flow
const testFlow = async () => {
  console.log('🧪 Testing Negotiation to Booking Flow\n');

  // Step 1: Student Login
  console.log('1️⃣ Student Login...');
  let response = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'student@test.com',
      password: 'Test@123'
    })
  });
  let data = await response.json();

  if (!data.success) {
    console.log('❌ Student login failed:', data.error);
    return;
  }

  const studentToken = data.data.accessToken;
  const studentId = data.data.user._id;
  console.log('✅ Student logged in:', studentId);

  // Step 2: Owner Login
  console.log('\n2️⃣ Owner Login...');
  response = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'owner@test.com',
      password: 'Test@123'
    })
  });
  data = await response.json();

  if (!data.success) {
    console.log('❌ Owner login failed:', data.error);
    return;
  }

  const ownerToken = data.data.accessToken;
  console.log('✅ Owner logged in');

  // Step 3: Get a room
  console.log('\n3️⃣ Fetching available room...');
  response = await fetch('http://localhost:3000/api/rooms?limit=1', {
    headers: { 'Authorization': 'Bearer ' + studentToken }
  });
  data = await response.json();

  if (!data.success || !data.data.rooms || data.data.rooms.length === 0) {
    console.log('❌ No rooms found');
    return;
  }

  const room = data.data.rooms[0];
  console.log('✅ Room found:', room.title);
  console.log('   Original Price: ₹' + room.price);

  // Step 4: Student creates negotiation
  console.log('\n4️⃣ Student creates negotiation...');
  const proposedPrice = Math.floor(room.price * 0.8); // 20% discount

  response = await fetch('http://localhost:3000/api/negotiations', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + studentToken,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      roomId: room._id,
      proposedPrice: proposedPrice,
      duration: 12,
      message: 'I need long-term accommodation'
    })
  });
  data = await response.json();

  if (!data.success) {
    console.log('❌ Negotiation creation failed:', data.error);
    return;
  }

  const negotiationId = data.data._id;
  console.log('✅ Negotiation created:', negotiationId);
  console.log('   Proposed Price: ₹' + proposedPrice);
  console.log('   Status:', data.data.status);

  // Step 5: Owner counters
  console.log('\n5️⃣ Owner makes counter offer...');
  const counterOffer = Math.floor(room.price * 0.9); // Meet in middle at 10% discount

  response = await fetch('http://localhost:3000/api/negotiations/' + negotiationId, {
    method: 'PATCH',
    headers: {
      'Authorization': 'Bearer ' + ownerToken,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      action: 'counter',
      counterOffer: counterOffer,
      message: 'I can offer this for 12 months'
    })
  });
  data = await response.json();

  if (!data.success) {
    console.log('❌ Counter offer failed:', data.error);
    return;
  }

  console.log('✅ Counter offer made');
  console.log('   Counter Price: ₹' + counterOffer);
  console.log('   Status:', data.data.status);

  // Step 6: Student accepts counter (NEW ENDPOINT)
  console.log('\n6️⃣ Student accepts counter offer...');

  response = await fetch('http://localhost:3000/api/negotiations/' + negotiationId + '/accept-counter', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + studentToken }
  });
  data = await response.json();

  if (!data.success) {
    console.log('❌ Accept counter failed:', data.error);
    return;
  }

  console.log('✅ Counter offer accepted!');
  console.log('   Final Price: ₹' + data.data.finalPrice);
  console.log('   Savings: ₹' + data.data.savings);
  console.log('   Can Book:', data.data.canBook);
  console.log('   Status:', data.data.negotiation.status);

  // Step 7: Student creates booking at negotiated price (ENHANCED ENDPOINT)
  console.log('\n7️⃣ Student creates booking at negotiated price...');

  const moveInDate = new Date();
  moveInDate.setDate(moveInDate.getDate() + 7); // 1 week from now

  response = await fetch('http://localhost:3000/api/bookings', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + studentToken,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      roomId: room._id,
      negotiationId: negotiationId,
      moveInDate: moveInDate.toISOString(),
      duration: 12
    })
  });
  data = await response.json();

  if (!data.success) {
    console.log('❌ Booking creation failed:', data.error);
    return;
  }

  console.log('✅ Booking created successfully!');
  console.log('   Booking ID:', data.data.booking._id);
  console.log('   Monthly Rent: ₹' + data.data.booking.monthlyRent + ' (Negotiated!)');
  console.log('   Security Deposit: ₹' + data.data.booking.securityDeposit);
  console.log('   Total Amount: ₹' + data.data.booking.totalAmount);
  console.log('   Negotiation Ref:', data.data.booking.negotiation || 'None');
  console.log('   Status:', data.data.booking.status);

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 NEGOTIATION TO BOOKING FLOW SUMMARY');
  console.log('='.repeat(60));
  console.log('Original Price:    ₹' + room.price + '/month');
  console.log('Student Proposed:  ₹' + proposedPrice + '/month');
  console.log('Owner Countered:   ₹' + counterOffer + '/month');
  console.log('Final Agreed:      ₹' + data.data.booking.monthlyRent + '/month');
  console.log('Student Saved:     ₹' + (room.price - data.data.booking.monthlyRent) + '/month');
  console.log('Total Savings:     ₹' + ((room.price - data.data.booking.monthlyRent) * 12) + '/year');
  console.log('='.repeat(60));
  console.log('\n✅ ALL TESTS PASSED! Negotiation to booking flow is working!');
};

testFlow().catch(err => console.error('Test failed:', err));
