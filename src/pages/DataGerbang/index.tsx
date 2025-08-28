import { GeneralTable, type TableColumn } from "../../components/GeneralTable";
import PageWrapper from "../../components/PageWrapper";
import FilterCard from "../../components/Filter";
import { styled } from "@mui/material/styles";
import {
  Button as MuiButton,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
  CircularProgress,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  AnimatedFilterCard,
  AnimatedTableWrapper,
  FloatingElements,
  LoadingShimmer,
} from "../../utils/theme/animated.tsx";

import { useGerbang } from "../../stores/masterGerbang/hooks.ts";
import type { GerbangItem } from "../../utils/api/MasterGerbangService/responseModel.ts";

const Card = styled(Paper)(() => ({
  padding: "24px",
  borderRadius: "12px",
  boxShadow: "0 8px 32px rgba(35, 65, 127, 0.1)",
  border: "1px solid #f2c20f",
  height: "100%",
  marginTop: "24px",
  display: "flex",
  flexDirection: "column",
  width: "100%",
  alignItems: "flex-end",
}));

const Button = styled(MuiButton)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "12px 24px",
  backgroundColor: theme.palette.primary.main,
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: 500,
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#1565c0",
  },
}));

const DeleteButton = styled(MuiButton)(() => ({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "12px 24px",
  backgroundColor: "#d32f2f",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: 500,
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#b71c1c",
  },
}));

const LoadingContainer = styled("div")({
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
});

const LoadingTable = () => (
  <LoadingContainer>
    {Array.from({ length: 8 }).map((_, index) => (
      <LoadingShimmer
        key={index}
        style={{
          animationDelay: `${index * 0.1}s`,
          height: index === 0 ? "30px" : "20px",
          opacity: index === 0 ? 0.9 : 0.7,
        }}
      />
    ))}
  </LoadingContainer>
);

const MasterDataGerbang: React.FC = () => {
  const columns: TableColumn[] = [
    { key: "id", label: "ID Gerbang", width: 80 },
    { key: "IdCabang", label: "ID Cabang", width: 100 },
    { key: "NamaGerbang", label: "Nama Gerbang", width: 150 },
    { key: "NamaCabang", label: "Nama Cabang", width: 200 },
  ];

  const {
    refetchData,
    isLoading,
    data,
    deleteGerbang,
    addGerbang,
    updateGerbang,
  } = useGerbang();

  const tableData = data.data.rows.rows;

  useEffect(() => {
    refetchData();
  }, []);

  const [open, setOpen] = useState(false);
  const [id, setId] = useState<number | "">("");
  const [idCabang, setIdCabang] = useState<number | "">("");
  const [ruas, setRuas] = useState("");
  const [gerbang, setGerbang] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<GerbangItem | null>(null);
  const [search, setSearch] = useState<{ searchText: string } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenAdd = () => {
    setEditIndex(null);
    setId("");
    setIdCabang("");
    setRuas("");
    setGerbang("");
    setOpen(true);
  };

  const handleOpenEdit = (row: Record<string, string | number | undefined>) => {
    const gerbang = row as GerbangItem;

    setEditIndex(gerbang.id);
    setId(gerbang.id);
    setIdCabang(gerbang.IdCabang);
    setRuas(gerbang.NamaCabang);
    setGerbang(gerbang.NamaGerbang);
    setOpen(true);
  };

  const handleSave = async () => {
    setIsSubmitting(true);

    try {
      if (editIndex === null) {
        await addGerbang({
          id: id,
          IdCabang: idCabang,
          NamaGerbang: ruas,
          NamaCabang: gerbang,
        });
        setSnackMessage("Data Berhasil Disimpan");
      } else {
        await updateGerbang({
          id: id,
          IdCabang: idCabang,
          NamaGerbang: ruas,
          NamaCabang: gerbang,
        });
        setSnackMessage("Data Berhasil Diupdate");
      }

      setOpen(false);
      setId("");
      setIdCabang("");
      setGerbang("");
      setRuas("");
      setEditIndex(null);
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error saving data:", error);
      setSnackMessage("Terjadi kesalahan saat menyimpan data");
      setOpenSnackbar(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenDeleteModal = (
    row: Record<string, string | number | undefined>,
  ) => {
    const gerbang = row as GerbangItem;
    setItemToDelete(gerbang);
    setOpenDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    setIsDeleting(true);

    try {
      await deleteGerbang({
        id: itemToDelete.id,
        IdCabang: itemToDelete.IdCabang,
      });

      setSnackMessage("Data Berhasil Dihapus");
      setOpenSnackbar(true);
      setOpenDeleteModal(false);
      setItemToDelete(null);
    } catch (error) {
      console.error("Error deleting data:", error);
      setSnackMessage("Terjadi kesalahan saat menghapus data");
      setOpenSnackbar(true);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setItemToDelete(null);
  };

  const handleCloseFormModal = () => {
    if (!isSubmitting) {
      setOpen(false);
      setId("");
      setIdCabang("");
      setGerbang("");
      setRuas("");
      setEditIndex(null);
    }
  };

  return (
    <PageWrapper title={"Data Master Gerbang"}>
      <AnimatedFilterCard>
        <FilterCard showSearchInput onFilter={setSearch} />
      </AnimatedFilterCard>
      <Card>
        <Button variant="contained" onClick={handleOpenAdd}>
          Tambah Data Baru
        </Button>

        {/* Modal Form Add/Edit */}
        <Dialog
          open={open}
          onClose={handleCloseFormModal}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>
            {editIndex === null ? "Tambah Data Gerbang" : "Edit Data Gerbang"}
          </DialogTitle>
          <DialogContent
            sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
          >
            <TextField
              label="ID"
              value={id}
              type={"number"}
              onChange={(e) => setId(Number(e.target.value))}
              fullWidth
              disabled={editIndex !== null || isSubmitting}
            />
            <TextField
              label="ID Gerbang"
              value={idCabang}
              type={"number"}
              onChange={(e) => setIdCabang(Number(e.target.value))}
              fullWidth
              disabled={editIndex !== null || isSubmitting}
            />
            <TextField
              label="Ruas"
              value={ruas}
              onChange={(e) => setRuas(e.target.value)}
              fullWidth
              disabled={isSubmitting}
            />
            <TextField
              label="Gerbang"
              value={gerbang}
              onChange={(e) => setGerbang(e.target.value)}
              fullWidth
              disabled={isSubmitting}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button
              onClick={handleCloseFormModal}
              variant="contained"
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button
              onClick={handleSave}
              variant="contained"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <CircularProgress size={16} color="inherit" sx={{ mr: 1 }} />
                  {editIndex === null ? "Menyimpan..." : "Mengupdate..."}
                </>
              ) : (
                "Simpan"
              )}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Modal Delete Confirmation */}
        <Dialog
          open={openDeleteModal}
          onClose={handleCloseDeleteModal}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Konfirmasi Hapus</DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Typography>
              Apakah Anda yakin ingin menghapus data gerbang ini?
            </Typography>
            {itemToDelete && (
              <Typography
                sx={{ mt: 2, p: 2, bgcolor: "grey.100", borderRadius: 1 }}
              >
                <strong>ID:</strong> {itemToDelete.id}
                <br />
                <strong>Nama Gerbang:</strong> {itemToDelete.NamaGerbang}
                <br />
                <strong>Nama Cabang:</strong> {itemToDelete.NamaCabang}
              </Typography>
            )}
            <Typography
              sx={{ mt: 2, color: "error.main", fontSize: "0.875rem" }}
            >
              Data yang sudah dihapus tidak dapat dikembalikan.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button
              onClick={handleCloseDeleteModal}
              variant="contained"
              disabled={isDeleting}
            >
              Batal
            </Button>
            <DeleteButton
              onClick={handleConfirmDelete}
              variant="contained"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <CircularProgress size={16} color="inherit" sx={{ mr: 1 }} />
                  Menghapus...
                </>
              ) : (
                "Hapus"
              )}
            </DeleteButton>
          </DialogActions>
        </Dialog>

        <FloatingElements>
          <AnimatedTableWrapper>
            {isLoading ? (
              <LoadingTable />
            ) : (
              <GeneralTable
                showExport={true}
                columns={columns}
                data={tableData}
                keyField="no"
                pagination={{
                  enabled: true,
                  rowsPerPage: 5,
                  rowsPerPageOptions: [5, 10, 25],
                }}
                hover={true}
                size="small"
                isEditable
                onEdit={handleOpenEdit}
                onDelete={handleOpenDeleteModal}
                searchValue={search?.searchText}
              />
            )}
          </AnimatedTableWrapper>
        </FloatingElements>
      </Card>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => {
          setOpenSnackbar(false);
          setSnackMessage("");
        }}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackMessage}
        </Alert>
      </Snackbar>
    </PageWrapper>
  );
};

export default MasterDataGerbang;
