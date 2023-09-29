import React, { useState } from "react"
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

const ModalData = ({
  handleCallback,
  open,
  selectedData,
  fieldType,
  dropdownList
}) => {
  console.log(selectedData)

  const [dropdownOpen, setDropdown] = useState(false)
  const [value, setValue] = useState(selectedData)
  const closeModal = () => {
    console.log("click me")
    handleCallback(false)
  }
  const toggle = () => {
    setDropdown((dropdownOpen) => !dropdownOpen)
  }
  return (
    <Modal isOpen={open} className="modal-dialog-centered" toggle={closeModal}>
      <ModalBody>
        <div className="form-check form-check-inline">
          <Label for="basic-cb-unchecked" className="form-check-label">
            Select {fieldType}
          </Label>
          <Dropdown toggle={toggle} isOpen={dropdownOpen}>
            <DropdownToggle caret>{value}</DropdownToggle>
            <DropdownMenu>
              {dropdownList.length > 0 &&
                dropdownList.map((item) => (
                  <DropdownItem onClick={() => setValue(item)}>
                    {item}
                  </DropdownItem>
                ))}
            </DropdownMenu>
          </Dropdown>
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
export default ModalData
