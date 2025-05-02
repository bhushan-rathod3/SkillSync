import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material";
import { useAuthContext } from "../../contexts/AuthProvider";
import { getBidsOnProject, approveBid } from "../../api/bids";
import { getProjectById } from "../../api/projects";
import { Bid, BidStatus, Project, ProjectStatus } from "../../types";
import { showSuccessToast, showErrorToast } from "../../utils/toast";

export default function BidsForProject() {
  const { id } = useParams();
  const projectId = id ? parseInt(id) : 0;
  const [bids, setBids] = useState<Bid[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Fetch both project details and bids
    Promise.all([getProjectById(projectId), getBidsOnProject(projectId)])
      .then(([projectRes, bidsRes]) => {
        console.log("Project response:", projectRes.data);
        console.log("Bids response:", bidsRes.data);

        // Handle project data
        if (
          projectRes.data &&
          (projectRes.data.success || projectRes.data.id)
        ) {
          const projectData = projectRes.data.data || projectRes.data;
          if ("id" in projectData) {
            setProject(projectData);
          } else {
            console.warn("Invalid project data format");
          }
        } else {
          console.warn("Failed to load project details");
        }

        // Handle bids data
        if (
          bidsRes.data &&
          (bidsRes.data.success || Array.isArray(bidsRes.data))
        ) {
          // Handle both ApiResponse wrapper and direct array
          const bidsData =
            bidsRes.data.data ||
            (Array.isArray(bidsRes.data) ? bidsRes.data : []);
          setBids(bidsData);
        } else {
          setError(bidsRes.data?.message || "Failed to load bids");
        }
      })
      .catch((err) => {
        console.error("Data fetch error:", err);
        setError("An error occurred while fetching data");
      })
      .finally(() => setLoading(false));
  }, [projectId]);

  const handleApprove = (bidId: number) => {
    approveBid(bidId, BidStatus.APPROVED)
      .then((res) => {
        console.log("Approve bid response:", res.data);
        if (res.data && (res.data.success || res.data.id)) {
          // Update the bid in the local state
          const updatedBid = res.data.data || res.data;
          setBids(
            bids.map((bid) =>
              bid.id === bidId ? { ...bid, status: BidStatus.APPROVED } : bid
            )
          );
          showSuccessToast("Bid approved successfully!");

          // Update project status in local state
          if (project) {
            setProject({
              ...project,
              status: ProjectStatus.ASSIGNED,
            });
          }
        } else {
          showErrorToast(res.data?.message || "Failed to approve bid");
        }
      })
      .catch((err) => {
        console.error("Approve bid error:", err);
        showErrorToast("An error occurred while approving the bid");
      });
  };

  const handleReject = (bidId: number) => {
    approveBid(bidId, BidStatus.REJECTED)
      .then((res) => {
        console.log("Reject bid response:", res.data);
        if (res.data && (res.data.success || res.data.id)) {
          // Update the bid in the local state
          const updatedBid = res.data.data || res.data;
          setBids(
            bids.map((bid) =>
              bid.id === bidId ? { ...bid, status: BidStatus.REJECTED } : bid
            )
          );
          showSuccessToast("Bid rejected successfully");
        } else {
          showErrorToast(res.data?.message || "Failed to reject bid");
        }
      })
      .catch((err) => {
        console.error("Reject bid error:", err);
        showErrorToast("An error occurred while rejecting the bid");
      });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box my={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5">Bids for Project #{projectId}</Typography>
        <Button
          variant="outlined"
          component={Link}
          to={`/client/projects/${projectId}`}
        >
          Back to Project
        </Button>
      </Box>

      {bids.length === 0 ? (
        <Alert severity="info">
          No bids have been submitted for this project yet.
        </Alert>
      ) : (
        bids.map((bid) => (
          <Card key={bid.id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle1">
                Freelancer: {bid.freelancer?.name || "Unknown"}
              </Typography>
              <Typography>Amount: ₹{bid.bidAmount}</Typography>
              <Typography>Duration: {bid.durationDays} days</Typography>
              <Typography>Message: {bid.bidMessage}</Typography>
              <Typography>Status: {bid.status}</Typography>

              {/* Show action buttons if project is still open */}
              {project && project.status === ProjectStatus.OPEN && (
                <Box mt={2}>
                  {bid.status === BidStatus.PENDING && (
                    <>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleApprove(bid.id)}
                      >
                        Approve Bid
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleReject(bid.id)}
                        sx={{ ml: 2 }}
                      >
                        Reject Bid
                      </Button>
                    </>
                  )}
                  {bid.status === BidStatus.APPROVED && (
                    <Chip color="success" label="This bid has been approved" />
                  )}
                  {bid.status === BidStatus.REJECTED && (
                    <Chip color="error" label="This bid has been rejected" />
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
}
