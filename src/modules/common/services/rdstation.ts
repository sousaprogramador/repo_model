import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { User } from 'src/modules/database/models/users.entity';
import { FRONT_WEB_URL, RDSTATION } from 'src/settings';
import { CacheService } from './cache';
export interface ILeadEvent {
  event_type?: string; //	true	The event type that diferentiates the event. For the conversion event it should be sent as "CONVERSION".
  event_family?: string; //	true	The family of the event for processing purposes. It currently accepts only "CDP" as valid option.
  conversion_identifier?: string; //	true	The name of the conversion event.
  name?: string; //	false	Name of the contact.
  email?: string; //	true	Email of the contact.
  job_title?: string; //	false	Job title of the contact.
  state?: string; //	false	State of the contact.
  city?: string; //	false	City of the contact.
  country?: string; //	false	Country of the contact.
  personal_phone?: string; //	false	Phone of the contact.
  mobile_phone?: string; //	false	Mobile phone of the contact.
  twitter?: string; //	false	Twitter handler of the contact.
  facebook?: string; //	false	Facebook of the contact.
  linkedin?: string; //	false	Linkedin of the contact.
  website?: string; //	false	Website of the contact.
  cf_custom_field_api_identifier?: string; //	false	Custom field and its value related to the contact.
  company_name?: string; //	false	Company name of the contact.
  company_site?: string; //	false	Company website of the contact.
  company_address?: string; //	false	Company address of the contact.
  client_tracking_id?: string; //	false	Value of a '_rdtrk' cookie. (e.g?: 43b00843-09af-4fae-bf9d-a0697640b808)
  traffic_source?: string; //	false	This can either be the value of a '__trf.src' cookie (base 64 encoded or not) or an UTM source param. If passing a cookie the following fields MUST be empty?: traffic_medium, traffic_campaign and traffic_value.
  traffic_medium?: string; //	false	UTM medium param.
  traffic_campaign?: string; //	false	UTM campaign param.
  traffic_value?: string; //	false	UTM value param (term).
  tags?: string[]; // Array of Strings	false	Tags that can be added to the contact.
  available_for_mailing?: boolean; //	false	Enable/disable receive emails.
  legal_bases?: [string]; // Array of Objects	false	Legal Bases of the contact.
}

@Injectable()
export class RDStationService {
  logger: Logger;
  url: string;

  constructor(@Inject(forwardRef(() => CacheService)) private cache: CacheService) {
    this.logger = new Logger('RDStationServiece');
    this.url = `${RDSTATION.CONVERSIONS_URL}?api_key=${RDSTATION.API_KEY}`;
  }

  mountLeadData(userData: User, extraData?: Partial<ILeadEvent>) {
    const data: ILeadEvent = {};

    data.name = userData.name;
    data.email = userData.email;

    if (userData.facebookId) {
      data.facebook = `https://www.facebook.com/profile.php?id=${userData.facebookId}`;
    }

    const birthDate = userData.birthDate ? new Date(userData.birthDate) : null;
    const birthDateDay = birthDate ? birthDate.getDate() : null,
      birthDateMonth = birthDate ? birthDate.getMonth() + 1 : null;

    return {
      ...data,
      cf_genero: userData.gender,
      cf_link_para_convite: `${FRONT_WEB_URL}/cadastro?convite=${userData.inviteCode}`,
      cf_dia_de_aniversario: birthDateDay,
      cf_mes_de_aniversario: birthDateMonth,
      ...extraData
    };
  }

  async signUpLead(leadData) {
    const data = {
      ...leadData
    };
    this.logger.log(`Criar novo Lead no RDStation: ${data.email}`);
    try {
      const response = await axios.post(
        this.url,
        {
          event_type: 'CONVERSION',
          event_family: 'CDP',
          payload: data
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      this.logger.log('Lead convertido: ${data.email}');

      return {
        success: true,
        uuid: response.data.event_uuid
      };
    } catch (error) {
      this.logger.error(error);
      if (error.response) {
        this.logger.error(error.response.data);
        this.logger.error(error.response.status);
        this.logger.error(error.response.headers);
      }
      return {
        success: false,
        error
      };
    }
  }

  async addTag({ email, tagName }) {
    this.logger.log('Addtag');
    await this.signUpLead({
      email,
      tags: [tagName],
      conversion_identifier: 'API_UPDATE'
    });
  }

  async patchLeadInformations({ email, data }) {
    this.logger.log('Tentando atualizar lead no RDStation');
    try {
      const token = await this.cache.getRDToken();

      const response = await axios.patch(`${RDSTATION.BASE_URL}platform/contacts/email:${email}`, data, {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });

      this.logger.log('Lead atualizado com sucesso');

      return {
        success: true,
        lead: response.data
      };
    } catch (error) {
      this.logger.error(error.response.data.errors);
      return {
        success: false,
        lead: null,
        error
      };
    }
  }

  async refreshTokenRDStation() {
    this.logger.log('Tentando renovar token RDStation');
    try {
      const response = await axios.post(`${RDSTATION.BASE_URL}auth/token`, {
        client_id: RDSTATION.CLIENT_ID,
        client_secret: RDSTATION.CLIENT_SECRET,
        refresh_token: RDSTATION.REFRESH_TOKEN
      });
      this.logger.log('Token renovado com sucesso');
      return response.data;
    } catch (e) {
      this.logger.error('Falha ao tentar atualizar token do RDStation');
      this.logger.error(e);
    }
  }

  async authRdStation() {
    try {
      const response = await axios.post(`${RDSTATION.BASE_URL}auth/token`, {
        client_id: RDSTATION.CLIENT_ID,
        client_secret: RDSTATION.CLIENT_SECRET,
        code: RDSTATION.CODE
      });
      return response.data;
    } catch (e) {
      this.logger.error('Falha ao tentar autenticar no RDStation');
      this.logger.error(e);
    }
  }
}
