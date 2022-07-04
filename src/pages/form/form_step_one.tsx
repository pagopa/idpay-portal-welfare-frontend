import {
    Paper,
    Typography,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    TextField,
    Box,
    Grid,
    Button,
    InputLabel,
    MenuItem,
    Select,
    Switch,
    SelectChangeEvent,
  } from '@mui/material';
  import { useFormik } from 'formik';
  import { useState } from 'react';
  
  const StepOne = () => {
    const formik = useFormik({
      initialValues: {
        venture: Boolean,
        addressees: Boolean,
        budged: Number,
        incomingAde: Date,
        expireAde: Date,
        incomingFund: Date,
        expireFund: Date,
      },
      onSubmit: (values) => {
        alert(JSON.stringify(values, null, 2));
      },
    });
  
    const [age, setAge] = useState('');
  
    const handleChange = (event: SelectChangeEvent) => {
      setAge(event.target.value);
    };
  
    return (
      <>
        <form onSubmit={formik.handleSubmit} style={{ marginLeft: '24px' }}>
          <Box sx={{ display: 'grid', width: '100%' }}>
            <Paper sx={{ padding: '16px', mr: 3, width: '100%' }}>
              <Box sx={{ ml: 3 }}>
                <Box sx={{ display: 'grid', width: '100%', mt: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Informazioni generali
                  </Typography>
                </Box>
  
                <Box sx={{ display: 'grid', mt: 3 }}>
                  <FormControl>
                    <Box sx={{ display: 'grid', mt: 3 }}>
                      <FormLabel id="demo-row-radio-buttons-group-label">
                        A chi è rivolta l’iniziativa?
                      </FormLabel>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                      <Grid
                        container
                        sx={{
                          width: '100%',
                          gridTemplateColumns: 'repeat(12, 1fr)',
                          gridTemplateRows: 'auto',
                          mt: 2,
                        }}
                      >
                        <RadioGroup
                          row
                          aria-labelledby="demo-row-radio-buttons-group-label"
                          name="row-radio-buttons-group"
                        >
                          <FormControl>
                            <Grid item>
                              <FormControlLabel
                                value="Persona fisica"
                                control={<Radio />}
                                label="Persona fisica"
                              />
                              <FormControlLabel
                                sx={{ mr: 4 }}
                                value="Nucleo Familiare"
                                control={<Radio />}
                                label="Nucleo Familiare"
                              />
                            </Grid>
                          </FormControl>
                        </RadioGroup>
                      </Grid>
                    </Box>
                  </FormControl>
                </Box>
  
                <Box sx={{ display: 'grid', mt: 3 }}>
                  <FormControl>
                    <Box sx={{ display: 'grid', mt: 3 }}>
                      <FormLabel id="demo-row-radio-buttons-group-label">
                        Conosci già i destinatari?
                      </FormLabel>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                      <Grid
                        container
                        sx={{
                          width: '100%',
                          gridTemplateColumns: 'repeat(12, 1fr)',
                          gridTemplateRows: 'auto',
                          mt: 2,
                        }}
                      >
                        <RadioGroup
                          row
                          aria-labelledby="demo-row-radio-buttons-group-label"
                          name="row-radio-buttons-group"
                        >
                          <FormControl>
                            <Grid item>
                              <FormControlLabel
                                value="Si, ho una lista di codici fiscali"
                                control={<Radio />}
                                label="Si, ho una lista di codici fiscali"
                              />
                              <FormControlLabel
                                sx={{ ml: 4 }}
                                value="No, imposterò dei criteri d'ammissione"
                                control={<Radio />}
                                label="No, imposterò dei criteri d'ammissione"
                              />
                            </Grid>
                          </FormControl>
                        </RadioGroup>
                      </Grid>
                    </Box>
                  </FormControl>
                </Box>
  
                <Box sx={{ display: 'grid' }}>
                  <FormControl>
                    <Box sx={{ mt: 4 }}>
                      <FormLabel>Qual è il tuo budget?</FormLabel>
                    </Box>
                    <Box>
                      <Grid
                        container
                        sx={{
                          width: '100%',
                          gridTemplateColumns: 'repeat(12, 1fr)',
                          gridTemplateRows: 'auto',
                          mt: 2,
                        }}
                      >
                        <Grid item>
                          <TextField
                            sx={{ width: 325, mr: 4 }}
                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                            label="Budget totale"
                            placeholder="Budget totale"
                          />
                          <TextField
                            sx={{ width: 325 }}
                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                            label="Budget a persona"
                            placeholder="Budget a persona"
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  </FormControl>
                </Box>
  
                <Box sx={{ display: 'grid' }}>
                  <FormControl>
                    <Box sx={{ display: 'grid', mt: 6 }}>
                      <FormLabel id="demo-row-radio-buttons-group-label">
                        Quando è possibile aderire?
                      </FormLabel>
                    </Box>
                    <Grid
                      container
                      sx={{
                        width: '100%',
                        gridTemplateColumns: 'repeat(12, 1fr)',
                        gridTemplateRows: 'auto',
                        mt: 2,
                      }}
                    >
                      <Grid item>
                        <TextField
                          id="date"
                          label="Inizio adesione"
                          type="date"
                          defaultValue={null}
                          sx={{ width: 325, mr: 4 }}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                        <TextField
                          id="date"
                          label="Fine adesione"
                          type="date"
                          defaultValue={null}
                          sx={{ width: 325 }}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>
                    </Grid>
                  </FormControl>
                </Box>
  
                <Box sx={{ display: 'grid', mb: 4 }}>
                  <FormControl>
                    <Box sx={{ display: 'grid', mt: 4 }}>
                      <FormLabel id="demo-row-radio-buttons-group-label">
                        Quando è possibile spendere i fondi?
                      </FormLabel>
                    </Box>
                    <Grid
                      container
                      sx={{
                        width: '100%',
                        gridTemplateColumns: 'repeat(12, 1fr)',
                        gridTemplateRows: 'auto',
                        mt: 2,
                      }}
                    >
                      <Grid item>
                        <TextField
                          id="date"
                          label="Inizio periodo"
                          type="date"
                          defaultValue={null}
                          sx={{ width: 325, mr: 4 }}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                        <TextField
                          id="date"
                          label="Fine periodo"
                          type="date"
                          defaultValue={null}
                          sx={{ width: 325 }}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>
                    </Grid>
                  </FormControl>
                </Box>
              </Box>
            </Paper>
          </Box>
  
          <Box sx={{ display: 'grid', width: '100%', mt: 5 }}>
            <Paper sx={{ padding: '16px', mr: 3, width: '100%' }}>
              <Box sx={{ ml: 3 }}>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Altre informazioni
                  </Typography>
                </Box>
                <Box sx={{ mt: 3 }}>
                  <FormLabel>
                    L’iniziativa può essere fruita dall’app IO, dalle app degli Issuer convenzionati e
                    presso la Rete Anti Digital-Divide. Per erogare l’iniziativa su IO è necessario
                    associarla ad un servizio che verrà esposto in app.
                  </FormLabel>
                </Box>
                <Box>
                  <Button variant="text" size="medium" sx={{ padding: 0 }}>
                    Scopri di più
                  </Button>
                </Box>
                <Box sx={{ mt: 3 }}>
                  <FormControl>
                    <FormControlLabel control={<Switch />} label="Eroga l'iniziativa su IO" />
                  </FormControl>
                </Box>
                <Box sx={{ mt: 5 }}>
                  <FormControl>
                    <Grid
                      container
                      sx={{
                        width: '100%',
                        gridTemplateColumns: 'repeat(12, 1fr)',
                        gridTemplateRows: 'auto',
                        mt: 2,
                      }}
                    >
                      <Grid item>
                        <InputLabel id="demo-simple-select-helper-label" sx={{ mt: 2 }}>
                          Seleziona un servizio
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-helper-label"
                          id="demo-simple-select-helper"
                          value={age}
                          label="Seleziona un servizio"
                          placeholder="Seleziona un servizio"
                          onChange={handleChange}
                          sx={{ width: 700 }}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          <MenuItem value="Carta della cultura">Carta della cultura</MenuItem>
                          <MenuItem value="Carta Giovani Nazionale">Carta Giovani Nazionale</MenuItem>
                        </Select>
                      </Grid>
                    </Grid>
                  </FormControl>
                </Box>
              </Box>
            </Paper>
          </Box>
        </form>
      </>
    );
  };
  
  export default StepOne;
  