import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
import { getMyBids } from "../../api/bids";
import { Bid, BidStatus } from "../../types";
import { showErrorToast } from "../../utils/toast";

export default function MyBids() {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getMyBids()
      .then((res) => {
        console.log("My bids response:", res.data);
        if (res.data && (res.data.success || Array.isArray(res.data))) {
          // Handle both ApiResponse wrapper and direct array
          const bidsData =
            res.data.data || (Array.isArray(res.data) ? res.data : []);
          setBids(bidsData);
        } else {
          setError(res.data?.message || "Failed to load bids");
        }
      })
      .catch((err) => {
        console.error("My bids fetch error:", err);
        setError("An error occurred while fetching your bids");
        showErrorToast("Failed to load your bids. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, []);

  const getBidStatusColor = (status: BidStatus) => {
    switch (status) {
      case BidStatus.APPROVED:
        return "success";
      case BidStatus.REJECTED:
        return "error";
      case BidStatus.PENDING:
      default:
        return "warning";
    }
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
      <Typography variant="h5" gutterBottom>
        My Bids
      </Typography>

      {bids.length === 0 ? (
        <Alert severity="info">
          You haven't submitted any bids yet. Browse available projects to start
          bidding!
        </Alert>
      ) : (
        bids.map((bid) => (
          <Card key={bid.id} sx={{ mb: 2 }}>
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
              >
                <Typography variant="h6">
                  {bid.project?.title || "Project"}
                </Typography>
                <Chip
                  label={bid.status}
                  color={getBidStatusColor(bid.status as BidStatus)}
                />
              </Box>

              <Typography variant="body1" gutterBottom>
                Bid Amount: ₹{bid.bidAmount}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Duration: {bid.durationDays} days
              </Typography>
              <Typography variant="body1" gutterBottom>
                Message: {bid.bidMessage}
              </Typography>

              <Box mt={2}>
                <Button
                  variant="outlined"
                  component={Link}
                  to={`/freelancer/projects/${bid.project?.id}`}
                >
                  View Project
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
}
