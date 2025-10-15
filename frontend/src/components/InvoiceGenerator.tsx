import React, { useState, useEffect } from 'react';

interface Invoice {
  id: string;
  vendor: string;
  client: string;
  amount: number;
  date: string;
  dueDate: string;
  status: string;
}

const InvoiceGenerator: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [vendor, setVendor] = useState('');
  const [client, setClient] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');

  // Fix debug button functionality
  useEffect(() => {
    const debugButton = document.querySelector('[class*="debug"]');
    if (debugButton) {
      debugButton.addEventListener('click', handleDebugClick);
    }

    return () => {
      if (debugButton) {
        debugButton.removeEventListener('click', handleDebugClick);
      }
    };
  }, []);

  const handleDebugClick = () => {
    console.log('=== INVOICE DEBUG INFO ===');
    console.log('Total invoices:', 1);
    console.log('Current invoice data:', getInvoiceData());
    console.log('======================');
  };

  const handleGenerateInvoice = () => {
    if (vendor && client && amount && dueDate) {
      const newInvoice: Invoice = {
        id: `INV-${String(1235).padStart(6, '0')}`,
        vendor,
        client,
        amount: parseFloat(amount),
        date: new Date().toISOString().split('T')[0],
        dueDate,
        status: 'Pending'
      };

      console.log('New invoice created:', newInvoice);
      alert(`Invoice created!\nVendor: ${vendor}\nClient: ${client}\nAmount: $${amount}`);
      
      // Reset form
      setShowForm(false);
      setVendor('');
      setClient('');
      setAmount('');
      setDueDate('');
    } else {
      alert('Please fill all fields');
    }
  };

  const getInvoiceData = () => {
    return {
      invoices: [
        { 
          id: 'INV-001234', 
          vendor: 'CloudBash Technologies', 
          client: 'Enterprise Solutions Ltd', 
          amount: 4070.00, 
          status: 'Pending' 
        }
      ]
    };
  };

  return (
    <div style={{ margin: '20px 0' }}>
      {/* Generate Invoice Button */}
      <button
        onClick={() => setShowForm(true)}
        style={{
          margin: '15px',
          padding: '10px 15px',
          background: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        ➕ Generate New Invoice
      </button>

      {/* Invoice Form Modal */}
      {showForm && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'white',
          padding: '20px',
          border: '2px solid #007bff',
          borderRadius: '8px',
          zIndex: 1000,
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}>
          <h3>Quick Invoice</h3>
          
          <input
            type="text"
            placeholder="Vendor"
            value={vendor}
            onChange={(e) => setVendor(e.target.value)}
            style={{ margin: '5px', padding: '8px', width: '200px' }}
          /><br />
          
          <input
            type="text"
            placeholder="Client"
            value={client}
            onChange={(e) => setClient(e.target.value)}
            style={{ margin: '5px', padding: '8px', width: '200px' }}
          /><br />
          
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ margin: '5px', padding: '8px', width: '200px' }}
          /><br />
          
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            style={{ margin: '5px', padding: '8px', width: '200px' }}
          /><br />
          
          <button
            onClick={handleGenerateInvoice}
            style={{
              margin: '5px',
              padding: '8px 15px',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            Create
          </button>
          
          <button
            onClick={() => setShowForm(false)}
            style={{
              margin: '5px',
              padding: '8px 15px',
              background: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default InvoiceGenerator;