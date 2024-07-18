import axios from 'axios';

const LoadingCNPJ = props => {
    const cnpj = String(props?.steps?.['cnpj']?.value).replace(/\D+/g, '');

    axios.get(`https://publica.cnpj.ws/cnpj/${cnpj}`, { timeout: 60000 }).then(({ data }) => {
      if (!data?.erro) {
          props.triggerNextStep({ 
            value: data?.estabelecimento?.cep,
            defaultTrigger: '7',
            overwrite: { 
              socialReason: data?.razao_social, 
              fantasyName: data?.estabelecimento?.nome_fantasia, 
              cep: data?.estabelecimento?.cep, 
            },
          });
      } else {
          props.triggerNextStep({ trigger: 'cnpj-failure', value: false });
      }
    }).catch((err) => {
      props.triggerNextStep({ trigger: 'cnpj-error', value: false });
    })
}

export default LoadingCNPJ;