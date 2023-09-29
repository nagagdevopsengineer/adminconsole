import React, { useState } from "react"
import Flatpickr from 'react-flatpickr'
import 'flatpickr/dist/flatpickr.min.css'
import {
  Row,
  Col,
  Card,
  Input,
  Label,
  Button,
  CardBody,
  CardTitle,
  CardHeader,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap"

const ModalTimeData = ({
    handleTimeCallback,
  openTime,
  selectedData
}) => {
  console.log(selectedData)

  //const [dropdownOpen, setDropdown] = useState(false)
  const [starttime, setStartTime] = useState("")
  const closeModal = () => {
    console.log("click me")
    handleTimeCallback(false)
  }
  /* const toggle = () => {
    setDropdown((dropdownOpen) => !dropdownOpen)
  } */
  return (
    <Modal isOpen={openTime} className="modal-dialog-centered" toggle={closeModal}>
      <ModalBody>
        <div className="form-check form-check-inline">
          <Label for="basic-cb-unchecked" className="form-check-label">
            Select Time
          </Label>
          <Flatpickr
            className='form-control'
            value={starttime}
            id='timepicker'
            options={{
              enableTime: true,
              noCalendar: true,
              dateFormat: 'h:i',
              time_24hr: false
            }}
            onChange={date => setStartTime(date)}
          />
        </div>
        <br />
      </ModalBody>
      <ModalFooter>
        <Button color="primary">Save</Button>
        <Button color="primary" onClick={closeModal}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  )
}
export default ModalTimeData
