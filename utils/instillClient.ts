import InstillClient from 'instill-sdk';

const client = new InstillClient(
  "https://api.instill.tech",
  "v1alpha",
  process.env.INSTILL_API_TOKEN || ""
);

export default client;
