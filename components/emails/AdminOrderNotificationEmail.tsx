import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Preview,
    Section,
    Text,
} from "@react-email/components";
import * as React from "react";

interface AdminOrderNotificationEmailProps {
    userName: string;
    userEmail: string;
    phoneNumber?: string;
    location?: string;
    items: Array<{
        title: string;
        price: number;
        productType: string;
    }>;
    total: number;
    charges?: number;
    orderId: string;
}

export const AdminOrderNotificationEmail = ({
    userName,
    userEmail,
    phoneNumber,
    location,
    items,
    total,
    charges,
    orderId,
}: AdminOrderNotificationEmailProps) => (
    <Html>
        <Head />
        <Preview>New Order Received - Order #{orderId.slice(-6)}</Preview>
        <Body style={main}>
            <Container style={container}>
                <Section style={header}>
                    <Heading style={logo}>DKC BOOKS ADMIN</Heading>
                </Section>
                <Section style={content}>
                    <Heading style={h1}>New Sale Recorded!</Heading>
                    <Text style={text}>
                        A new order has been successfully placed on the store.
                    </Text>

                    <Section style={detailsContainer}>
                        <Heading style={h2}>Customer Details</Heading>
                        <Text style={detailLine}><strong>Name:</strong> {userName}</Text>
                        <Text style={detailLine}><strong>Email:</strong> {userEmail}</Text>
                        <Text style={detailLine}><strong>Phone:</strong> {phoneNumber || 'N/A'}</Text>
                        <Text style={detailLine}><strong>Location:</strong> {location || 'N/A'}</Text>
                    </Section>

                    <Section style={detailsContainer}>
                        <Heading style={h2}>Order Summary</Heading>
                        <Text style={orderIdText}>Order ID: {orderId}</Text>
                        {items.map((item, index) => (
                            <Section key={index} style={itemRow}>
                                <Text style={itemTitle}>{item.title} ({item.productType})</Text>
                                <Text style={itemPrice}>GHS {item.price.toFixed(2)}</Text>
                            </Section>
                        ))}
                        {charges && (
                            <Section style={itemRow}>
                                <Text style={itemTitle}>Charges (2%)</Text>
                                <Text style={itemPrice}>GHS {charges.toFixed(2)}</Text>
                            </Section>
                        )}
                        <Hr style={hr} />
                        <Section style={itemRow}>
                            <Text style={totalLabel}>Total Revenue</Text>
                            <Text style={totalValue}>GHS {total.toFixed(2)}</Text>
                        </Section>
                    </Section>

                    <Text style={footer}>
                        Admin Notification System &copy; {new Date().getFullYear()} DKC BOOKS.
                    </Text>
                </Section>
            </Container>
        </Body>
    </Html>
);

export default AdminOrderNotificationEmail;

const main = {
    backgroundColor: "#f0f2f5",
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "32px",
    marginBottom: "64px",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
    maxWidth: "600px",
};

const header = {
    textAlign: "center" as const,
    borderBottom: "2px solid #ea580c",
    paddingBottom: "16px",
    marginBottom: "24px",
};

const logo = {
    color: "#1e293b",
    fontSize: "24px",
    fontWeight: "900",
    margin: "0",
    letterSpacing: "-0.02em",
};

const content = {
    padding: "0 4px",
};

const h1 = {
    color: "#22c55e",
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center" as const,
    margin: "24px 0",
};

const h2 = {
    color: "#334155",
    fontSize: "16px",
    fontWeight: "bold",
    borderBottom: "1px solid #e2e8f0",
    paddingBottom: "8px",
    marginBottom: "16px",
};

const text = {
    color: "#64748b",
    fontSize: "16px",
    lineHeight: "24px",
    textAlign: "center" as const,
};

const detailsContainer = {
    backgroundColor: "#f8fafc",
    borderRadius: "12px",
    padding: "20px",
    margin: "24px 0",
    border: "1px solid #f1f5f9",
};

const detailLine = {
    fontSize: "14px",
    color: "#475569",
    margin: "4px 0",
};

const orderIdText = {
    fontSize: "12px",
    color: "#94a3b8",
    marginBottom: "16px",
};

const itemRow = {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: "8px",
};

const itemTitle = {
    fontSize: "14px",
    color: "#334155",
    margin: "0",
    fontWeight: "500",
};

const itemPrice = {
    fontSize: "14px",
    color: "#334155",
    margin: "0",
};

const totalLabel = {
    fontSize: "15px",
    fontWeight: "bold",
    color: "#1e293b",
    margin: "0",
};

const totalValue = {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#ea580c",
    margin: "0",
};

const hr = {
    borderColor: "#e2e8f0",
    margin: "16px 0",
};

const footer = {
    color: "#94a3b8",
    fontSize: "12px",
    textAlign: "center" as const,
    marginTop: "32px",
};
