import React from 'react';
import { Button, ButtonGroup } from '@mui/material';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <ButtonGroup size="small" variant="outlined" sx={{ mr: 2 }}>
      <Button 
        onClick={() => changeLanguage('uk')}
        variant={i18n.language === 'uk' ? 'contained' : 'outlined'}
        sx={{ fontWeight: 600 }}
      >
        UA
      </Button>
      <Button 
        onClick={() => changeLanguage('en')}
        variant={i18n.language === 'en' ? 'contained' : 'outlined'}
        sx={{ fontWeight: 600 }}
      >
        EN
      </Button>
    </ButtonGroup>
  );
};

export default LanguageSwitcher;
