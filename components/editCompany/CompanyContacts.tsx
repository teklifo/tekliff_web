import React, {
  FC,
  Fragment,
  FormEvent,
  Dispatch,
  SetStateAction,
  useState,
} from "react";
import useTranslation from "next-translate/useTranslation";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import AddIcon from "@mui/icons-material/Add";
import ContactForm from "./ContactForm";
import { CompanyContact } from "../../types";

const CompanyContacts: FC<{
  contacts: CompanyContact[];
  setContacts: Dispatch<SetStateAction<CompanyContact[]>>;
}> = ({ contacts, setContacts }) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState<boolean>(false);

  const handleOnClick = (event: FormEvent) => {
    event.preventDefault();
    setOpen(true);
  };

  const onClose = (contact: CompanyContact | null) => {
    setOpen(false);
    if (contact) {
      setContacts((prevState) => {
        return [...prevState, contact];
      });
    }
  };

  return (
    <Fragment>
      <Box>
        <Button
          type="submit"
          variant="contained"
          disableElevation
          size="large"
          startIcon={<AddIcon />}
          onClick={handleOnClick}
        >
          <Typography fontWeight="bold">{t("editCompany:add")}</Typography>
        </Button>
        <ContactForm open={open} onClose={onClose} />
      </Box>
      {contacts.length > 0 && (
        <TableContainer>
          <Table aria-label="contacts table">
            <TableHead>
              <TableRow>
                <TableCell>{t("editCompany:contactType")}</TableCell>
                <TableCell>{t("editCompany:value")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contacts.map((contact, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>{t(`editCompany:${contact.type}`)}</TableCell>
                    <TableCell>{contact.value}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Fragment>
  );
};

export default CompanyContacts;
