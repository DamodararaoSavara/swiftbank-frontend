import "./Services.css";

export default function Services() {
  return (
    <div className="services-container">
      <h1 className="services-title">Our Banking Services</h1>

      <div className="services-grid">
        <div className="service-card">
          <h3>Savings Account</h3>
          <p>Earn higher interest with flexible savings options.</p>
        </div>

        <div className="service-card">
          <h3>Current Account</h3>
          <p>Perfect for businesses with unlimited transactions.</p>
        </div>

        <div className="service-card">
          <h3>Home Loans</h3>
          <p>Affordable home loans with flexible repayment plans.</p>
        </div>

        <div className="service-card">
          <h3>Vehicle Loans</h3>
          <p>Drive your dream vehicle with easy EMI options.</p>
        </div>

        <div className="service-card">
          <h3>Fixed Deposits</h3>
          <p>Secure your future with guaranteed FD returns.</p>
        </div>

        <div className="service-card">
          <h3>Digital Banking</h3>
          <p>Bank anytime, anywhere with our digital services.</p>
        </div>
      </div>
    </div>
  );
}
