import React, { Component } from 'react';
import { StatusBar, View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import RNPickerSelect from 'react-native-picker-select';
import { Icon } from 'react-native-elements'

import * as actions from '../redux/actions'
import { ItemsListVertical, ItemsListHorizontal, SquareItem, Card, CardSection } from '../commonComponents'
import { getVideosHomeScreen } from '../utils'
import { BACKGROUND_COLOR, TEXT_COLOR } from '../style'

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nextPageToken: '',
      isLoading: false,
      countResults: 0,
      totalResults: 0,
      listItem: [],
      regionCode: '',
      picker: '',
    };
    this.offset = 0;
  }

  getVideos(maxResults, regionCode, pageToken) {
    this.setState({ isLoading: true })
    getVideosHomeScreen(maxResults, regionCode, pageToken).then((result) => {
      let newListItem = this.state.listItem
      result.videos.map(element => {
        let index = this.state.listItem.findIndex(el => el.categoryId === element.categoryId)
        if (index == -1) {
          newListItem = newListItem.concat(element)
        } else {
          newListItem[index].list = newListItem[index].list.concat(element.list)
        }
      })
      this.setState({
        listItem: newListItem,
        nextPageToken: result.nextPageToken,
        isLoading: false,
        countResults: this.state.countResults + maxResults,
        totalResults: result.pageInfo.totalResults
      })
    }).catch((error) => {
      console.log(error)
    });
  }

  componentDidMount() {
    this.getVideos(50, this.state.regionCode);
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: BACKGROUND_COLOR, height: '100%' }}>
        <StatusBar backgroundColor={BACKGROUND_COLOR} barStyle="light-content" />

        <RNPickerSelect
          items={regions}
          onClose={() => {
            if (this.state.regionCode != this.state.picker) {
              this.setState({ listItem: [], countResults: 0, regionCode: this.state.picker }, () => {
                this.getVideos(50, this.state.regionCode)
              })
            }
          }}
          onValueChange={value => {
            this.setState({
              picker: value
            });
          }}
          style={{
            ...pickerSelectStyles,
            iconContainer: {
              top: 10,
              right: 12,
            },
          }}
          value={this.state.picker}
          doneText={"Select"}
          useNativeAndroidPickerStyle={false}
          textInputProps={{ underlineColor: 'yellow' }}
          Icon={() => {
            return <Icon color={"gray"} size={24} name='skip-next' />
          }}
        />

        <ItemsListVertical
          isLoading={this.state.isLoading}
          onCloseToEdge={() => {
            if (!this.state.isLoading && this.state.countResults < this.state.totalResults && this.state.listItem.length != 0)
              this.getVideos(50, this.state.regionCode, this.state.nextPageToken)
          }}
        >
          {this.state.listItem.map((element, elementKey) => {
            if (element.list && element.list.length > 0)
              return (
                <Card key={elementKey}>
                  <CardSection>
                    <Text style={styles.cardTitleStyle}>{element.title}</Text>
                  </CardSection>
                  <ItemsListHorizontal
                    isLoading={this.state.isLoading}
                    onCloseToEdge={() => {
                      if (!this.state.isLoading && this.state.countResults < this.state.totalResults && this.state.listItem.length != 0)
                        this.getVideos(50, this.state.regionCode, this.state.nextPageToken)
                    }}
                  >
                    {element.list.map((item, itemKey) => {
                      return (
                        <SquareItem
                          item={item}
                          key={itemKey}
                          style={{ marginBottom: 5 }}
                          onPress={() => {
                            this.props.navigation.navigate('Play', { videoId: item.id })
                          }}
                        />
                      )
                    })}
                  </ItemsListHorizontal>
                </Card>
              )
          })}
        </ItemsListVertical>
      </View >
    );
  }
}
export default connect(null, actions)(HomeScreen)

const styles = StyleSheet.create({
  cardTitleStyle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: TEXT_COLOR,
    backgroundColor: BACKGROUND_COLOR
  }
})

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: 'black'
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: 'black'
  },
});

const regions = [
  { label: 'Global', value: '' },
  { label: 'Viet Nam', value: 'VN' },
  { label: 'Afghanistan', value: 'AF' },
  { label: 'Åland Islands', value: 'AX' },
  { label: 'Albania', value: 'AL' },
  { label: 'Algeria', value: 'DZ' },
  { label: 'American Samoa', value: 'AS' },
  { label: 'AndorrA', value: 'AD' },
  { label: 'Angola', value: 'AO' },
  { label: 'Anguilla', value: 'AI' },
  { label: 'Antarctica', value: 'AQ' },
  { label: 'Antigua and Barbuda', value: 'AG' },
  { label: 'Argentina', value: 'AR' },
  { label: 'Armenia', value: 'AM' },
  { label: 'Aruba', value: 'AW' },
  { label: 'Australia', value: 'AU' },
  { label: 'Austria', value: 'AT' },
  { label: 'Azerbaijan', value: 'AZ' },
  { label: 'Bahamas', value: 'BS' },
  { label: 'Bahrain', value: 'BH' },
  { label: 'Bangladesh', value: 'BD' },
  { label: 'Barbados', value: 'BB' },
  { label: 'Belarus', value: 'BY' },
  { label: 'Belgium', value: 'BE' },
  { label: 'Belize', value: 'BZ' },
  { label: 'Benin', value: 'BJ' },
  { label: 'Bermuda', value: 'BM' },
  { label: 'Bhutan', value: 'BT' },
  { label: 'Bolivia', value: 'BO' },
  { label: 'Bosnia and Herzegovina', value: 'BA' },
  { label: 'Botswana', value: 'BW' },
  { label: 'Bouvet Island', value: 'BV' },
  { label: 'Brazil', value: 'BR' },
  { label: 'British Indian Ocean Territory', value: 'IO' },
  { label: 'Brunei Darussalam', value: 'BN' },
  { label: 'Bulgaria', value: 'BG' },
  { label: 'Burkina Faso', value: 'BF' },
  { label: 'Burundi', value: 'BI' },
  { label: 'Cambodia', value: 'KH' },
  { label: 'Cameroon', value: 'CM' },
  { label: 'Canada', value: 'CA' },
  { label: 'Cape Verde', value: 'CV' },
  { label: 'Cayman Islands', value: 'KY' },
  { label: 'Central African Republic', value: 'CF' },
  { label: 'Chad', value: 'TD' },
  { label: 'Chile', value: 'CL' },
  { label: 'China', value: 'CN' },
  { label: 'Christmas Island', value: 'CX' },
  { label: 'Cocos (Keeling) Islands', value: 'CC' },
  { label: 'Colombia', value: 'CO' },
  { label: 'Comoros', value: 'KM' },
  { label: 'Congo', value: 'CG' },
  { label: 'Congo, The Democratic Republic of the', value: 'CD' },
  { label: 'Cook Islands', value: 'CK' },
  { label: 'Costa Rica', value: 'CR' },
  { label: 'Cote D\'Ivoire', value: 'CI' },
  { label: 'Croatia', value: 'HR' },
  { label: 'Cuba', value: 'CU' },
  { label: 'Cyprus', value: 'CY' },
  { label: 'Czech Republic', value: 'CZ' },
  { label: 'Denmark', value: 'DK' },
  { label: 'Djibouti', value: 'DJ' },
  { label: 'Dominica', value: 'DM' },
  { label: 'Dominican Republic', value: 'DO' },
  { label: 'Ecuador', value: 'EC' },
  { label: 'Egypt', value: 'EG' },
  { label: 'El Salvador', value: 'SV' },
  { label: 'Equatorial Guinea', value: 'GQ' },
  { label: 'Eritrea', value: 'ER' },
  { label: 'Estonia', value: 'EE' },
  { label: 'Ethiopia', value: 'ET' },
  { label: 'Falkland Islands (Malvinas)', value: 'FK' },
  { label: 'Faroe Islands', value: 'FO' },
  { label: 'Fiji', value: 'FJ' },
  { label: 'Finland', value: 'FI' },
  { label: 'France', value: 'FR' },
  { label: 'French Guiana', value: 'GF' },
  { label: 'French Polynesia', value: 'PF' },
  { label: 'French Southern Territories', value: 'TF' },
  { label: 'Gabon', value: 'GA' },
  { label: 'Gambia', value: 'GM' },
  { label: 'Georgia', value: 'GE' },
  { label: 'Germany', value: 'DE' },
  { label: 'Ghana', value: 'GH' },
  { label: 'Gibraltar', value: 'GI' },
  { label: 'Greece', value: 'GR' },
  { label: 'Greenland', value: 'GL' },
  { label: 'Grenada', value: 'GD' },
  { label: 'Guadeloupe', value: 'GP' },
  { label: 'Guam', value: 'GU' },
  { label: 'Guatemala', value: 'GT' },
  { label: 'Guernsey', value: 'GG' },
  { label: 'Guinea', value: 'GN' },
  { label: 'Guinea-Bissau', value: 'GW' },
  { label: 'Guyana', value: 'GY' },
  { label: 'Haiti', value: 'HT' },
  { label: 'Heard Island and Mcdonald Islands', value: 'HM' },
  { label: 'Holy See (Vatican City State)', value: 'VA' },
  { label: 'Honduras', value: 'HN' },
  { label: 'Hong Kong', value: 'HK' },
  { label: 'Hungary', value: 'HU' },
  { label: 'Iceland', value: 'IS' },
  { label: 'India', value: 'IN' },
  { label: 'Indonesia', value: 'ID' },
  { label: 'Iran, Islamic Republic Of', value: 'IR' },
  { label: 'Iraq', value: 'IQ' },
  { label: 'Ireland', value: 'IE' },
  { label: 'Isle of Man', value: 'IM' },
  { label: 'Israel', value: 'IL' },
  { label: 'Italy', value: 'IT' },
  { label: 'Jamaica', value: 'JM' },
  { label: 'Japan', value: 'JP' },
  { label: 'Jersey', value: 'JE' },
  { label: 'Jordan', value: 'JO' },
  { label: 'Kazakhstan', value: 'KZ' },
  { label: 'Kenya', value: 'KE' },
  { label: 'Kiribati', value: 'KI' },
  { label: 'Korea, Democratic People\'S Republic of', value: 'KP' },
  { label: 'Korea, Republic of', value: 'KR' },
  { label: 'Kuwait', value: 'KW' },
  { label: 'Kyrgyzstan', value: 'KG' },
  { label: 'Lao People\'S Democratic Republic', value: 'LA' },
  { label: 'Latvia', value: 'LV' },
  { label: 'Lebanon', value: 'LB' },
  { label: 'Lesotho', value: 'LS' },
  { label: 'Liberia', value: 'LR' },
  { label: 'Libyan Arab Jamahiriya', value: 'LY' },
  { label: 'Liechtenstein', value: 'LI' },
  { label: 'Lithuania', value: 'LT' },
  { label: 'Luxembourg', value: 'LU' },
  { label: 'Macao', value: 'MO' },
  { label: 'Macedonia, The Former Yugoslav Republic of', value: 'MK' },
  { label: 'Madagascar', value: 'MG' },
  { label: 'Malawi', value: 'MW' },
  { label: 'Malaysia', value: 'MY' },
  { label: 'Maldives', value: 'MV' },
  { label: 'Mali', value: 'ML' },
  { label: 'Malta', value: 'MT' },
  { label: 'Marshall Islands', value: 'MH' },
  { label: 'Martinique', value: 'MQ' },
  { label: 'Mauritania', value: 'MR' },
  { label: 'Mauritius', value: 'MU' },
  { label: 'Mayotte', value: 'YT' },
  { label: 'Mexico', value: 'MX' },
  { label: 'Micronesia, Federated States of', value: 'FM' },
  { label: 'Moldova, Republic of', value: 'MD' },
  { label: 'Monaco', value: 'MC' },
  { label: 'Mongolia', value: 'MN' },
  { label: 'Montserrat', value: 'MS' },
  { label: 'Morocco', value: 'MA' },
  { label: 'Mozambique', value: 'MZ' },
  { label: 'Myanmar', value: 'MM' },
  { label: 'Namibia', value: 'NA' },
  { label: 'Nauru', value: 'NR' },
  { label: 'Nepal', value: 'NP' },
  { label: 'Netherlands', value: 'NL' },
  { label: 'Netherlands Antilles', value: 'AN' },
  { label: 'New Caledonia', value: 'NC' },
  { label: 'New Zealand', value: 'NZ' },
  { label: 'Nicaragua', value: 'NI' },
  { label: 'Niger', value: 'NE' },
  { label: 'Nigeria', value: 'NG' },
  { label: 'Niue', value: 'NU' },
  { label: 'Norfolk Island', value: 'NF' },
  { label: 'Northern Mariana Islands', value: 'MP' },
  { label: 'Norway', value: 'NO' },
  { label: 'Oman', value: 'OM' },
  { label: 'Pakistan', value: 'PK' },
  { label: 'Palau', value: 'PW' },
  { label: 'Palestinian Territory, Occupied', value: 'PS' },
  { label: 'Panama', value: 'PA' },
  { label: 'Papua New Guinea', value: 'PG' },
  { label: 'Paraguay', value: 'PY' },
  { label: 'Peru', value: 'PE' },
  { label: 'Philippines', value: 'PH' },
  { label: 'Pitcairn', value: 'PN' },
  { label: 'Poland', value: 'PL' },
  { label: 'Portugal', value: 'PT' },
  { label: 'Puerto Rico', value: 'PR' },
  { label: 'Qatar', value: 'QA' },
  { label: 'Reunion', value: 'RE' },
  { label: 'Romania', value: 'RO' },
  { label: 'Russian Federation', value: 'RU' },
  { label: 'RWANDA', value: 'RW' },
  { label: 'Saint Helena', value: 'SH' },
  { label: 'Saint Kitts and Nevis', value: 'KN' },
  { label: 'Saint Lucia', value: 'LC' },
  { label: 'Saint Pierre and Miquelon', value: 'PM' },
  { label: 'Saint Vincent and the Grenadines', value: 'VC' },
  { label: 'Samoa', value: 'WS' },
  { label: 'San Marino', value: 'SM' },
  { label: 'Sao Tome and Principe', value: 'ST' },
  { label: 'Saudi Arabia', value: 'SA' },
  { label: 'Senegal', value: 'SN' },
  { label: 'Serbia and Montenegro', value: 'CS' },
  { label: 'Seychelles', value: 'SC' },
  { label: 'Sierra Leone', value: 'SL' },
  { label: 'Singapore', value: 'SG' },
  { label: 'Slovakia', value: 'SK' },
  { label: 'Slovenia', value: 'SI' },
  { label: 'Solomon Islands', value: 'SB' },
  { label: 'Somalia', value: 'SO' },
  { label: 'South Africa', value: 'ZA' },
  { label: 'South Georgia and the South Sandwich Islands', value: 'GS' },
  { label: 'Spain', value: 'ES' },
  { label: 'Sri Lanka', value: 'LK' },
  { label: 'Sudan', value: 'SD' },
  { label: 'Surilabel', value: 'SR' },
  { label: 'Svalbard and Jan Mayen', value: 'SJ' },
  { label: 'Swaziland', value: 'SZ' },
  { label: 'Sweden', value: 'SE' },
  { label: 'Switzerland', value: 'CH' },
  { label: 'Syrian Arab Republic', value: 'SY' },
  { label: 'Taiwan, Province of China', value: 'TW' },
  { label: 'Tajikistan', value: 'TJ' },
  { label: 'Tanzania, United Republic of', value: 'TZ' },
  { label: 'Thailand', value: 'TH' },
  { label: 'Timor-Leste', value: 'TL' },
  { label: 'Togo', value: 'TG' },
  { label: 'Tokelau', value: 'TK' },
  { label: 'Tonga', value: 'TO' },
  { label: 'Trinidad and Tobago', value: 'TT' },
  { label: 'Tunisia', value: 'TN' },
  { label: 'Turkey', value: 'TR' },
  { label: 'Turkmenistan', value: 'TM' },
  { label: 'Turks and Caicos Islands', value: 'TC' },
  { label: 'Tuvalu', value: 'TV' },
  { label: 'Uganda', value: 'UG' },
  { label: 'Ukraine', value: 'UA' },
  { label: 'United Arab Emirates', value: 'AE' },
  { label: 'United Kingdom', value: 'GB' },
  { label: 'United States', value: 'US' },
  { label: 'United States Minor Outlying Islands', value: 'UM' },
  { label: 'Uruguay', value: 'UY' },
  { label: 'Uzbekistan', value: 'UZ' },
  { label: 'Vanuatu', value: 'VU' },
  { label: 'Venezuela', value: 'VE' },
  { label: 'Viet Nam', value: 'VN' },
  { label: 'Virgin Islands, British', value: 'VG' },
  { label: 'Virgin Islands, U.S.', value: 'VI' },
  { label: 'Wallis and Futuna', value: 'WF' },
  { label: 'Western Sahara', value: 'EH' },
  { label: 'Yemen', value: 'YE' },
  { label: 'Zambia', value: 'ZM' },
  { label: 'Zimbabwe', value: 'ZW' }
]