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
        const response = await fetch('/json/invoice.json');

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

  const InvoiceUploader = (event) => {
    const file = event.target.files[0]

    if (file) {

      // Logic

      const newInvoice = {
        id: invoices.length + 1,
        amount: "100.00", // Ejemplo de monto
        date: new Date().toLocaleDateString(), // Fecha actual
        transactionNumber: `TX${invoinces.length + 100000}`
      }

      setInvoices([...invoices, newInvoice])

      setMessage('Invoice Uploaded Successfully')
      setError('')
    } else {
      setError('Error Uploading Invoice')
      setMessage('')
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
        <Input type="file" onChange={InvoiceUploader} />
        <Button onClick={InvoiceUploader}>Upload</Button>
        {message && <Alert type="success">{message}</Alert>}
        {error && <Alert type="error">{error}</Alert>}

        <Table className={styles.invoiceTable}>
          <TableCaption className={styles.subTitle}>
            <h2>List of Invoices</h2>
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]" style={{}}>Invoice</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Transaction Number</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.id}</TableCell>
                <TableCell>{invoice.date}</TableCell>
                <TableCell>{invoice.transactionNumber}</TableCell>
                <TableCell className="text-right">{invoice.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">
                ${invoices.reduce((total, invoice) => total +
                  parseFloat(invoice.amount), 0).toFixed(2)}
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
