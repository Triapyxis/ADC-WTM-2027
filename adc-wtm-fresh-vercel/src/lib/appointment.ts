export type AppointmentInput = {
  fullName: string;
  position: string;
  state: string;
  effectiveDate: string;
  responsibilities: string;
  email: string;
  phone: string;
};

export function cleanText(value: unknown, max = 3000): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export function appointmentLetter(input: AppointmentInput) {
  return `ADC WE-TOGETHER MOVEMENT

Date: ${input.effectiveDate}

APPOINTMENT AS ${input.position.toUpperCase()} — ${input.state.toUpperCase()}

Dear ${input.fullName},

On behalf of the National Executive Committee of the African Democratic Congress We-Together Movement (ADC-WTM), we are pleased to formally appoint you as ${input.position} of the ADC We-Together Movement in ${input.state}.

This appointment is made in recognition of your commitment, leadership capacity, integrity, and dedication to the principles, values, and objectives of the ADC We-Together Movement.

In your capacity as ${input.position}, you shall be responsible for:

${input.responsibilities}

Your appointment takes effect on ${input.effectiveDate} and shall remain valid until reviewed, amended, or revoked by the authorised National Leadership of the ADC We-Together Movement. You are expected to discharge the responsibilities of this office in accordance with the Movement's constitution, policies, directives, and established procedures, upholding the dignity of the office and acting in the best interests of ADC-WTM.

We congratulate you on this appointment and trust that you will justify the confidence reposed in you through dedicated, responsible, and exemplary service. We wish you a successful and productive tenure in office.

Yours faithfully,

Amb. Yusuf Sani, IEP
Convener/National Coordinator
ADC We-Together Movement

“We Rise, We Shine Together.”`;
}
