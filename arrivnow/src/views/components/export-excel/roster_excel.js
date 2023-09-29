import React from 'react'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import moment from 'moment'

import { Share, Download } from 'react-feather'
import { DropdownToggle, UncontrolledDropdown } from 'reactstrap'

const RosterExportExcel = ({csvData, fileName}) => {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    const fileExtension = '.xlsx'

    const exportToExcel = (csvData, fileName) => {
        const csvChangeData = []

        csvData.map((data, index) => {
            const bus_no = (data.attributes.bus.data) ? `${data.attributes.bus.data.attributes.vehicle_number} - ${data.attributes.bus.data.attributes.colour}` : ''
            csvChangeData.push({ 'S.NO': index + 1, Date: `${moment(data.attributes.from_date).format('DD/MM/YYYY')} - ${moment(data.attributes.to_date).format('DD/MM/YYYY')}`, Time: moment(data.attributes.timing, "hh:mm:ss").format("hh:mm A"), 'Driver Name': (data.attributes.driver.data) ? data.attributes.driver.data.attributes.name : '', 'Helper Name': (data.attributes.helper.data) ? data.attributes.helper.data.attributes.name : '', 'Bus No': bus_no })
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
export default RosterExportExcel