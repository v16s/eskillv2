import React from 'react'
import { Page, Text, Document, StyleSheet } from '@react-pdf/renderer'
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  DataTableCell
} from '@david.kucsai/react-pdf-table'

// Create styles
const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 35
  },
  author: {
    fontSize: 12,
    textAlign: 'right',
    color: '#666'
  },
  subtitle: {
    fontSize: 18,
    margin: 12
  },
  text: {
    margin: 12,
    fontSize: 14,
    textAlign: 'justify',
    fontFamily: 'Times-Roman'
  },
  image: {
    marginVertical: 15,
    marginHorizontal: 100
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: 'center',
    color: 'grey'
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey'
  }
})

// Create Document Component
const DocumentBase = ({ data, faculty, department, course }) => {
  console.log(data)
  return (
    <Document>
      <Page style={styles.body}>
        <Text style={styles.title}>SRM CARE eSkill Report</Text>
        {faculty && <Text style={styles.author}>Faculty: {faculty}</Text>}
        {department && (
          <Text style={styles.author}>Department: {department}</Text>
        )}
        <Text style={{ ...styles.author, marginBottom: 35 }}>
          Course: {course}
        </Text>
        <Table data={data}>
          <TableHeader>
            <TableCell>Register Number</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Percentage Completed</TableCell>
          </TableHeader>
          <TableBody>
            <DataTableCell getContent={r => r.regNumber} />
            <DataTableCell getContent={r => r.name} />
            <DataTableCell getContent={r => r.percentage} />
          </TableBody>
        </Table>
      </Page>
    </Document>
  )
}
export { DocumentBase as Document }
