"use client" /* Fix Later */
import {
  Table, TableBody, TableCaption, TableCell,
  TableFooter, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import styles from "./page.module.css";
import { useEffect, useState } from "react";

export default function Home() {
  const [invoices, setInvoices] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        const response = await fetch(`${process.env.NEST_APP_API_URL}/upload/invoice`);

        if (!response.ok) {
          throw new Error('Response Null')
        }

        const data = await response.json()

        setInvoices(data)
      } catch (error) {
        console.error("Error Getting invoices", error)
        setError('Failled Getting Invoices')
      }
    }

    loadInvoices()
  }, [])

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    InvoiceUploader(file); // Llama a la función con el archivo
  };

  const InvoiceUploader = async (file) => {

    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch(`${process.env.NEST_APP_API_URL}/upload/invoice`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to upload invoice');
        }

        setMessage('Invoice Uploaded Successfully');
        setError('');

        loadInvoices();
      } catch (error) {
        console.error("Error uploading invoice", error);
        setError('Error Uploading Invoice');
        setMessage('');
      }
    } else {
      setError('No file selected for upload');
      setMessage('');
    }
  }

  /**
  <Alert type="success">Invoice Uploaded Successfully</Alert>
  <Alert type="error">Error Uploading the Invoice</Alert>
  **/
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Upload your Invoice</h1>
        <Input type="file" accept=".pdf" onChange={handleFileChange} />
        <Button onClick={InvoiceUploader}>Upload</Button>
        {message && <Alert type="success">{message}</Alert>}
        {error && <Alert type="error">{error}</Alert>}
        <Table className={styles.invoiceTable}>
          <TableCaption className={styles.subTitle}>
            <h2>List of Invoices</h2>
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Invoice</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Client</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.id}</TableCell>
                <TableCell>{invoice.due_date}</TableCell>
                <TableCell>{invoice.bill_to}</TableCell>
                <TableCell className="text-right">{invoice.total_amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">
                ${invoices.reduce((total, invoice) => total + parseFloat(invoice.total_amount || 0), 0).toFixed(2)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </main>
      <footer className={styles.footer}>
        <ol>Reto Tenico 18-01 - Alonso Cáceres</ol>
      </footer>
    </div>
  );
}