import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
} from "@react-email/components";
import * as React from "react";

interface WelcomeEmailProps {
    userName: string;
}

export const WelcomeEmail = ({ userName }: WelcomeEmailProps) => (
    <Html>
        <Head />
        <Preview>Welcome to DKC BOOKS!</Preview>
        <Body style={main}>
            <Container style={container}>
                <Section style={header}>
                    <Heading style={logo}>DKC BOOKS</Heading>
                </Section>
                <Section style={content}>
                    <Heading style={h1}>Welcome aboard, {userName}!</Heading>
                    <Text style={text}>
                        We're thrilled to have you here. DKC BOOKS is your portal to a world of knowledge, courses, and premium resources designed to help you succeed.
                    </Text>
                    <Text style={text}>
                        You can now explore our shop, access your courses, and keep track of your progress directly from your dashboard.
                    </Text>
                    <Section style={buttonContainer}>
                        <Link style={button} href="https://dkc-books.vercel.app/dashboard">
                            Go to Dashboard
                        </Link>
                    </Section>
                    <Hr style={hr} />
                    <Text style={footer}>
                        If you have any questions, feel free to reply to this email or visit our support center.
                    </Text>
                    <Text style={footer}>
                        &copy; {new Date().getFullYear()} DKC BOOKS. All rights reserved.
                    </Text>
                </Section>
            </Container>
        </Body>
    </Html>
);

export default WelcomeEmail;

const main = {
    backgroundColor: "#f6f9fc",
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "20px 0 48px",
    marginBottom: "64px",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
};

const header = {
    padding: "32px",
    textAlign: "center" as const,
};

const logo = {
    color: "#ea580c",
    fontSize: "28px",
    fontWeight: "bold",
    margin: "0",
};

const content = {
    padding: "0 32px",
};

const h1 = {
    color: "#1a1a1a",
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center" as const,
    margin: "30px 0",
};

const text = {
    color: "#444",
    fontSize: "16px",
    lineHeight: "26px",
    textAlign: "left" as const,
};

const buttonContainer = {
    textAlign: "center" as const,
    margin: "32px 0",
};

const button = {
    backgroundColor: "#ea580c",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "inline-block",
    padding: "14px 24px",
};

const hr = {
    borderColor: "#e6ebf1",
    margin: "40px 0",
};

const footer = {
    color: "#8898aa",
    fontSize: "12px",
    lineHeight: "22px",
    textAlign: "center" as const,
};
