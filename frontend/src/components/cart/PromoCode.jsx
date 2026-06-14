import { useState, useEffect } from "react";

function PromoCode({ onApply, promoCode, message }) {
  const [code, setCode] = useState(promoCode || "");

  useEffect(() => {
    setCode(promoCode || "");
  }, [promoCode]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onApply(code);
  };

  return (
    <div className="promo-code-panel">
      <div className="promo-code-labels">
        <p>Promo Code</p>
        <span>Save more on premium styles.</span>
      </div>
      <form className="promo-code-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter code"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          aria-label="Promo code"
        />
        <button type="submit" className="apply-button">
          Apply
        </button>
      </form>
      {message && <p className="promo-message">{message}</p>}
    </div>
  );
}

export default PromoCode;
