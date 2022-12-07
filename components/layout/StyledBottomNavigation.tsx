import React, { FC, useState, useContext } from 'react';
import Hidden from '@mui/material/Hidden';
import Paper from '@mui/material/Paper';
import BottomNavigation from '@mui/material/BottomNavigation';
import { useTheme, alpha } from '@mui/material/styles';

const StyledBottomNavigation: FC = () => {
  const theme = useTheme();

  const [value, setValue] = useState<number>(0);

  const handleChange = (
    _event: React.SyntheticEvent<Element, Event>,
    newValue: number,
  ) => {};

  return (
    <Hidden mdUp>
      <Paper
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: '1000',
          backdropFilter: 'blur(20px)',
          backgroundColor: alpha(theme.palette.background.default, 0.7),
        }}
        elevation={0}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={handleChange}
          sx={{ backgroundColor: 'transparent' }}
        ></BottomNavigation>
      </Paper>
    </Hidden>
  );
};

export default StyledBottomNavigation;
