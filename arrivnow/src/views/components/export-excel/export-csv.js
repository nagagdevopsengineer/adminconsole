import React from 'react'
import { Share, Download } from 'react-feather'
import { DropdownToggle, UncontrolledDropdown } from 'reactstrap'

const ExportCSV = ({csvData, fileName}) => {
    function convertArrayOfObjectsToCSV(array) {
        let result

        const columnDelimiter = ','
        const lineDelimiter = '\n'
        const keys = Object.keys(array[0])

        result = ''
        result += keys.join(columnDelimiter)
        result += lineDelimiter

        array.forEach(item => {
        let ctr = 0
        keys.forEach(key => {
            if (ctr > 0) result += columnDelimiter

            result += item[key]

            ctr++
        })
        result += lineDelimiter
        })

        return result
    }

    const fileExtension = '.csv'

    const exportToCSV = (csvData, fileName) => {
        const link = document.createElement('a')
        let csv = convertArrayOfObjectsToCSV(csvData)
        if (csv === null) return

        if (!csv.match(/^data:text\/csv/i)) {
            csv = `data:text/csv;charset=utf-8,${csv}`
        }

        link.setAttribute('href', encodeURI(csv))
        link.setAttribute('download', fileName + fileExtension)
        link.click()
    }

    return (
        <UncontrolledDropdown className='me-1'>
            <DropdownToggle color='secondary' outline onClick={() => exportToCSV(csvData, fileName)}>
            <Download className='font-small-4 me-50' />
            <span className='align-middle'>Export</span>
            </DropdownToggle>
        </UncontrolledDropdown>
    )
}
export default ExportCSV