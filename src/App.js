import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { KeyboardArrowDown as KeyboardArrowDownIcon, KeyboardArrowUp as KeyboardArrowUpIcon } from '@mui/icons-material';

import "./App.css";

function App() {
  const [holdings, setHoldings] = useState([]);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const fetchHoldings = async () => {
      try {
        const response = await axios.get(
          "https://canopy-frontend-task.now.sh/api/holdings"
        );
        setHoldings(response.data.payload);
      } catch (error) {
        console.error("Error fetching holdings:", error);
      }
    };

    fetchHoldings();
  }, []);

  const toggleAccordion = (assetClass) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [assetClass]: !prevExpanded[assetClass],
    }));
  };


  const groupedHoldings = holdings.reduce((acc, holding) => {
    const { asset_class } = holding;
    if (!acc[asset_class]) {
      acc[asset_class] = [];
    }
    acc[asset_class].push(holding);
    return acc;
  }, {});

  return (
    <div>
      <h1 style={{textAlign:"center"}} className="h-5 text-lg">Holdings Viewers</h1>
      {Object.entries(groupedHoldings).map(([assetClass, holdings]) => (
        <Accordion 
        key={assetClass} 
        expanded={expanded[assetClass]}
        onChange={() => toggleAccordion(assetClass)}
      >
         <AccordionSummary
      expandIcon={<KeyboardArrowDownIcon />}
      collapseIcon={<KeyboardArrowUpIcon />}
    >
      
      {expanded[assetClass] ? (
        <KeyboardArrowUpIcon />
      ) : (
        <KeyboardArrowDownIcon />
      )}
            
            <Typography variant="h5" className="text-mg">{assetClass} ({holdings.length})</Typography>
           

          </AccordionSummary>
          <AccordionDetails>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Ticker</TableCell>
                    <TableCell>Average Price</TableCell>
                    <TableCell>Market Price</TableCell>
                    <TableCell>Latest Change Percentage</TableCell>
                    <TableCell>Market Value (Base CCY)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {holdings.map((holding, index) => (
                    <TableRow key={index}>
                      <TableCell>{holding.name}</TableCell>
                      <TableCell>{holding.ticker}</TableCell>
                      <TableCell className={holding.avg_price < 0 ? "negative-value" : ""}>{holding.avg_price}</TableCell>
                      <TableCell className={holding.market_price < 0 ? "negative-value" : ""}>{holding.market_price}</TableCell>
                      <TableCell className={holding.latest_chg_pct < 0 ? "negative-value" : ""}>{holding.latest_chg_pct}</TableCell>
                      <TableCell className={holding.market_value_ccy < 0 ? "negative-value" : ""}>{holding.market_value_ccy}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}

export default App;