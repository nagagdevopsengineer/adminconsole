import React from 'react'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import moment from 'moment'

import { Share, Download } from 'react-feather'
import { DropdownToggle, UncontrolledDropdown } from 'reactstrap'

const HelperExportExcel = ({csvData, fileName}) => {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    const fileExtension = '.xlsx'

    const exportToExcel = (csvData, fileName) => {
        const csvChangeData = []

        csvData.map((data, index) => {
            csvChangeData.push({ 'S.NO': index + 1, 'Full Name': data.attributes.name, 'Email ID': data.attributes.email, 'Contact Number': data.attributes.contact_number, DOB: (data.attributes.DOB) ? moment(data.attributes.DOB).format('DD/MM/YYYY') : '', 'Vaccination Status': data.attributes.vaccination_status, 'Aadhar Number': data.attributes.aadharnumber, 'Driving Licence Number': data.attributes.drivinglicense, Status: (data.attributes.status) ? data.attributes.status : 'Pending' })
        })
        const ws = XLSX.utils.json_to_sheet(csvChangeData)
        const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
        const data = new Blob([excelBuffer], {type: fileType})
        FileSaver.saveAs(data, fileName + fileExtension)
    }

    return (
        <UncontrolledDropdown className='me-1'>
            <DropdownToggle color='secondary' outline onClick={() => exportToExcel(csvData, fileName)}>
            <Download className='font-small-4 me-50' />
            <span className='align-middle'>Export</span>
            </DropdownToggle>
        </UncontrolledDropdown>
    )
}
export default HelperExportExcel