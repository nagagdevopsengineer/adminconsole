import React from 'react'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'

import { Share, Download } from 'react-feather'
import { DropdownToggle, UncontrolledDropdown } from 'reactstrap'

const RouteExportExcel = ({csvData, fileName}) => {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    const fileExtension = '.xlsx'

    const exportToExcel = (csvData, fileName) => {
        const csvChangeData = []

        csvData.map((data, index) => {
            /*let waypoints = ''
            data.stops.map((stop, s_index) => {
                if (s_index !== 0 && s_index !== (data.stops.length - 1)) {
                    waypoints += ` ${stop.name}`
                }

            }) */
            csvChangeData.push({ 'S.NO': index + 1, 'Route Name': data.attributes.name, 'Starting Point': data.stops[0].name, 'Ending Point': data.stops[data.stops.length - 1].name})
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
export default RouteExportExcel