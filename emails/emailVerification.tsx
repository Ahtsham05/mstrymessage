import {
    Body,
    Button,
    Container,
    Head,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
  } from '@react-email/components';
  import * as React from 'react';
  
  interface GithubAccessTokenEmailProps {
    username?: string;
    verifyCode?: string;
  }
  
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : '';
  
  export const emailVerification = ({
    username,
    verifyCode
  }: GithubAccessTokenEmailProps) => (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={section}>
            <Text style={text}>
              Hey <strong>{username}</strong>!
            </Text>
            <Text style={text}>
              Mstry Message email verification OTP :
            </Text>
            <Button style={button}>{verifyCode}</Button>
          </Section>
          <Text style={links}>
            <Link style={link}>don't Share this with anyone</Link> ・{' '}
            <Link style={link}>Contact support</Link>
          </Text>
  
          <Text style={footer}>
            mstry Message &copy; 2025, Inc. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
  
  emailVerification.PreviewProps = {
    username: 'alanturing',
  } as GithubAccessTokenEmailProps;
  
  export default emailVerification;
  
  const main = {
    backgroundColor: '#ffffff',
    color: '#24292e',
    fontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
  };
  
  const container = {
    maxWidth: '480px',
    margin: '0 auto',
    padding: '20px 0 48px',
  };
  
  const title = {
    fontSize: '24px',
    lineHeight: 1.25,
  };
  
  const section = {
    padding: '24px',
    border: 'solid 1px #dedede',
    borderRadius: '5px',
    textAlign: 'center' as const,
  };
  
  const text = {
    margin: '0 0 10px 0',
    textAlign: 'left' as const,
  };
  
  const button = {
    fontSize: '14px',
    backgroundColor: '#28a745',
    color: '#fff',
    lineHeight: 1.5,
    borderRadius: '0.5em',
    padding: '12px 24px',
  };
  
  const links = {
    textAlign: 'center' as const,
  };
  
  const link = {
    color: '#0366d6',
    fontSize: '12px',
  };
  
  const footer = {
    color: '#6a737d',
    fontSize: '12px',
    textAlign: 'center' as const,
    marginTop: '60px',
  };
  