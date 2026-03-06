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

interface ReceiptEmailProps {
    userName: string;
    items: Array<{
        title: string;
        price: number;
        productType: string;
    }>;
    total: number;
    orderId: string;
}

export const ReceiptEmail = ({ userName, items, total, orderId }: ReceiptEmailProps) => (
    <Html>
        <Head />
        <Preview>Order Confirmation - DKC BOOKS</Preview>
        <Body style={main}>
            <Container style={container}>
                <Section style={header}>
                    <Heading style={logo}>DKC BOOKS</Heading>
                </Section>
                <Section style={content}>
                    <Heading style={h1}>Thank you for your purchase, {userName}!</Heading>
                    <Text style={text}>
                        Your order has been confirmed. You now have full access to your content.
                    </Text>
                    <Text style={orderInfo}>Order: {orderId}</Text>

                    <Section style={summary}>
                        {items.map((item, index) => (
                            <Section key={index} style={itemRow}>
                                <Text style={itemTitle}>{item.title} ({item.productType})</Text>
                                <Text style={itemPrice}>GHS {item.price.toFixed(2)}</Text>
                            </Section>
                        ))}
                        <Hr style={hr} />
                        <Section style={itemRow}>
                            <Text style={totalLabel}>Total</Text>
                            <Text style={totalValue}>GHS {total.toFixed(2)}</Text>
                        </Section>
                    </Section>

                    <Section style={buttonContainer}>
                        <Link style={button} href="https://dkc-books.vercel.app/dashboard">
                            Access Your Content
                        </Link>
                    </Section>

                    <Hr style={hr} />
                    <Text style={footer}>
                        If you need assistance with your purchase, please contact us.
                    </Text>
                    <Text style={footer}>
                        &copy; {new Date().getFullYear()} DKC BOOKS. All rights reserved.
                    </Text>
                </Section>
            </Container>
        </Body>
    </Html>
);

export default ReceiptEmail;

const main = {
    backgroundColor: "#f6f9fc",
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "24px",
    marginBottom: "64px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
    maxWidth: "600px",
};

const header = {
    textAlign: "center" as const,
    paddingBottom: "32px",
};

const logo = {
    color: "#ea580c",
    fontSize: "28px",
    fontWeight: "900",
    margin: "0",
    letterSpacing: "-0.05em",
};

const content = {
    padding: "0 8px",
};

const h1 = {
    color: "#1a1a1a",
    fontSize: "26px",
    fontWeight: "bold",
    textAlign: "center" as const,
    margin: "30px 0",
};

const text = {
    color: "#525f7f",
    fontSize: "16px",
    lineHeight: "26px",
    textAlign: "center" as const,
};

const orderInfo = {
    color: "#8898aa",
    fontSize: "14px",
    textAlign: "center" as const,
    marginTop: "16px",
};

const summary = {
    backgroundColor: "#f9fafb",
    borderRadius: "12px",
    padding: "24px",
    margin: "40px 0",
};

const itemRow = {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: "12px",
};

const itemTitle = {
    fontSize: "15px",
    color: "#32325d",
    margin: "0",
    fontWeight: "500",
};

const itemPrice = {
    fontSize: "15px",
    color: "#32325d",
    margin: "0",
};

const totalLabel = {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#32325d",
    margin: "0",
};

const totalValue = {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#ea580c",
    margin: "0",
};

const buttonContainer = {
    textAlign: "center" as const,
    margin: "32px 0",
};

const button = {
    backgroundColor: "#ea580c",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "inline-block",
    padding: "16px 32px",
};

const hr = {
    borderColor: "#e6ebf1",
    margin: "24px 0",
};

const footer = {
    color: "#8898aa",
    fontSize: "12px",
    lineHeight: "22px",
    textAlign: "center" as const,
};
