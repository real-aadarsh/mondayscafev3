import { useState } from "react";

const reserveInitial = {
  name: "",
  email: "",
  phone: "",
  guests: "",
  reservation_date: "",
  reservation_time: "",
  message: "",
};

export default function ReserveForm() {
  const [reserveData, setReserveData] = useState(reserveInitial);
  const [reserveStatus, setReserveStatus] = useState({ tone: "", text: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onReserveChange = (event) => {
    const { name, value } = event.target;
    setReserveData((prev) => ({ ...prev, [name]: value }));
  };

  const onReserveSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitted) return;

    const required = ["name", "email", "phone", "guests", "reservation_date", "reservation_time"];
    const hasMissing = required.some((field) => !String(reserveData[field]).trim());

    if (hasMissing) {
      setReserveStatus({ tone: "is-error", text: "Please fill all required fields correctly before submitting." });
      return;
    }

    setIsSubmitting(true);
    setReserveStatus({ tone: "is-loading", text: "Sending your reservation request..." });

    try {
      const payload = new FormData();
      Object.entries(reserveData).forEach(([key, value]) => payload.append(key, value));
      payload.append("form_type", "Table Reservation");

      const response = await fetch("https://formspree.io/f/mvzvlpdv", {
        method: "POST",
        body: payload,
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        let errorText = "We could not send your request. Please try again.";
        try {
          const detail = await response.json();
          if (detail?.errors?.length) errorText = detail.errors.map((item) => item.message).join(" ");
        } catch {}
        throw new Error(errorText);
      }

      setIsSubmitted(true);
      setReserveStatus({ tone: "is-success", text: "Reservation request sent successfully. We will contact you shortly to confirm." });
    } catch (error) {
      setReserveStatus({
        tone: "is-error",
        text: error instanceof Error ? error.message : "We could not send your request. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={`contact-form reveal-item ${isSubmitted ? "is-submitted" : ""}`} onSubmit={onReserveSubmit}>
      <label>Full Name<input type="text" name="name" value={reserveData.name} onChange={onReserveChange} required disabled={isSubmitted} /></label>
      <label>Email<input type="email" name="email" value={reserveData.email} onChange={onReserveChange} required disabled={isSubmitted} /></label>
      <label>Phone<input type="tel" name="phone" value={reserveData.phone} onChange={onReserveChange} required disabled={isSubmitted} /></label>
      <label>Number of Guests<input type="number" name="guests" min="1" max="20" value={reserveData.guests} onChange={onReserveChange} required disabled={isSubmitted} /></label>
      <label>Reservation Date<input type="date" name="reservation_date" value={reserveData.reservation_date} onChange={onReserveChange} required disabled={isSubmitted} /></label>
      <label>Reservation Time<input type="time" name="reservation_time" value={reserveData.reservation_time} onChange={onReserveChange} required disabled={isSubmitted} /></label>
      <label>Special Requests<textarea name="message" rows="4" value={reserveData.message} onChange={onReserveChange} disabled={isSubmitted}></textarea></label>

      {!isSubmitted && <button className="button button-primary" type="submit" disabled={isSubmitting}>{isSubmitting ? "Submitting..." : "Reserve Table"}</button>}
      <p className={`form-status ${reserveStatus.tone ? `is-visible ${reserveStatus.tone}` : ""}`}>{reserveStatus.text}</p>
    </form>
  );
}
