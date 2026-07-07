const test = async () => {
  try {
    console.log('Logging in as admin...');
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@gmail.com',
        password: 'admin123'
      })
    });

    const loginData = await loginRes.json();
    if (!loginRes.ok) {
      console.error('Login failed:', loginData);
      return;
    }

    const token = loginData.token;
    console.log('Login successful! Token acquired.');

    console.log('Fetching all complaints...');
    const compRes = await fetch('http://localhost:5000/api/complaints', {
      headers: { Authorization: `Bearer ${token}` }
    });

    const compData = await compRes.json();
    console.log('API Response Success:', compData.success);
    console.log('API Response Count:', compData.count);
    if (compData.data && compData.data.length > 0) {
      console.log('First Complaint Details:', JSON.stringify(compData.data[0], null, 2));
    } else {
      console.log('No complaints returned in data array.');
    }

  } catch (err) {
    console.error('Error occurred:', err.message);
  }
};

test();
