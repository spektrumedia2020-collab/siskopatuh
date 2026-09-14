/**
 * Placeholder email notification service for EWS alerts.
 * In a real-world scenario, this would integrate with services like SendGrid, AWS SES, or NodeMailer (via backend API).
 */

export const sendEmailNotification = async (
  to: string,
  subject: string,
  htmlContent: string
): Promise<boolean> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  console.log(`[Email Service] ✉️ Sending email to: ${to}`);
  console.log(`[Email Service] 📝 Subject: ${subject}`);
  console.log(`[Email Service] 📄 Content: ${htmlContent}`);
  
  // Simulate successful email delivery
  return true;
};
