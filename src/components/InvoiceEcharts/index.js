import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link, Switch, Route, routerRedux } from 'dva/router';
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  Icon,
  Menu,
  Dropdown,
  notification,
  Tooltip,
  Select,
  Input,
  Modal,
  message,
  Divider,
} from 'antd';
import globalUtil from '../../utils/global';
import Echars from '../Echars';
import styles from './index.less';
import sourceUtil from '../../utils/source-unit';

@connect(
  ({ user, global }) => ({ groups: global.groups }),
  null,
  null,
  { withRef: true },
)
export default class Index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      datalist: [],
    };
  }
  componentDidMount() {
    this.getRegionResource();
  }
  // 获取某个数据中心的资源详情  // 新-- 数据中心列表
  getRegionResource() {
    this.props.dispatch({
      type: 'global/getRegionSource',
      payload: {
        team_name: globalUtil.getCurrTeamName(),
        enterprise_id: this.props.enterprise_id,
        region: '',
      },
      callback: (data) => {
        if (data) {
          this.setState({ datalist: data.list }, () => {
            const datalist = this.state.datalist;
          });
        }
      },
    });
  }

  render() {
    const datalist = this.state.datalist || [];
    return (
      <div className={styles.regionList}>
        <Row style={{ marginTop: 16, textAlign: 'center' }} className={styles.regionList}>
          {datalist.map((order) => {
            const hasDate = order.disk.expire_date || order.memory.expire_date;
            const normalColor = '#1890ff';
            const warningColor = '#f5222d';
            const blackColor = 'rgba(0,0,0,0.1)';
            return (
              <Col span={24} style={{ marginBottom: 16 }}>
                <Card>
                  <h2>{order.alias}</h2>
                  <p style={{ color: hasDate ? normalColor : warningColor, marginBottom: 32 }}>
                    {!hasDate ? (
                      '未包月'
                    ) : (
                        <span>包月到期: {order.disk.expire_date || '无限期'}</span>
                      )}
                  </p>
                  <Row>
                    <Col span="12">
                      <h3>内存</h3>
                      <div id={`${order.name}-memory`} style={{ width: '100%', height: '160px' }}>
                        <Echars
                          style={{ height: 150, width: 150 }}
                          option={{
                            color: [
                              order.memory.used === 0 && order.memory.limit === 0
                                ? blackColor
                                : order.memory.used > order.memory.limit
                                  ? warningColor
                                  : normalColor,
                              blackColor,
                            ],
                            series: [
                              {
                                name: '访问来源',
                                type: 'pie',
                                radius: ['75%', '85%'],
                                avoidLabelOverlap: false,
                                label: {
                                  normal: {
                                    show: true,
                                    position: 'center',
                                    formatter(argument) {
                                      var v = 0;
                                      if (order.memory.used === 0 && order.memory.limit === 0) {
                                        v = 0;
                                      } else {
                                        var v = (
                                          (order.memory.used /
                                            (order.memory.limit || order.memory.used)) *
                                          100
                                        ).toFixed(2);
                                      }
                                      let html;
                                      html = `已使用\r\n\r\n${v}%`;
                                      return html;
                                    },
                                    textStyle: {
                                      fontSize: 15,
                                      color: normalColor,
                                    },
                                  },
                                },
                                labelLine: {
                                  normal: {
                                    show: false,
                                  },
                                },
                                data: [
                                  { value: order.memory.used, name: '已使用' },
                                  { value: order.memory.stock, name: '未使用' },
                                ],
                              },
                            ],
                          }}
                        />
                      </div>
                      <p>
                        <span className={styles.usedAndLimit}>
                          <span className={styles.tit}>当前使用量</span>
                          <br />
                          {sourceUtil.unit(order.memory.used, 'MB')}
                        </span>

                        <span className={styles.usedAndLimit}>
                          <span className={styles.tit}>当前包月量</span>
                          <br />
                          {sourceUtil.unit(order.memory.limit, 'MB')}
                        </span>

                        <span className={styles.usedAndLimit}>
                          <span className={styles.tit}>
                            按需计费{' '}
                            <Tooltip title="举例： 当前使用10G， 当前包月5G，则10G-5G=5G为按需计费的量">
                              <Icon type="info" />
                            </Tooltip>
                          </span>
                          <br />
                          {sourceUtil.unit(
                            order.memory.limit < order.memory.used
                              ? order.memory.used - order.memory.limit
                              : 0,
                            'MB',
                          )}
                        </span>
                      </p>
                    </Col>
                    <Col span="12">
                      <h3>磁盘</h3>
                      <div id={`${order.name}-disk`} style={{ width: '100%', height: '160px' }}>
                        <Echars
                          style={{ height: 150, width: 150 }}
                          option={{
                            color: [
                              order.disk.used === 0 && order.disk.limit === 0
                                ? blackColor
                                : order.disk.used > order.disk.limit
                                  ? warningColor
                                  : normalColor,
                              blackColor,
                            ],
                            series: [
                              {
                                name: '访问来源',
                                type: 'pie',
                                radius: ['75%', '85%'],
                                avoidLabelOverlap: false,
                                label: {
                                  normal: {
                                    show: true,
                                    position: 'center',
                                    formatter(argument) {
                                      var v = 0;
                                      if (order.disk.used === 0 && order.disk.limit === 0) {
                                        v = 0;
                                      } else {
                                        var v = (
                                          (order.disk.used /
                                            (order.disk.limit || order.disk.used)) *
                                          100
                                        ).toFixed(2);
                                      }

                                      let html;
                                      html = `已使用\r\n\r\n${v}%`;
                                      return html;
                                    },
                                    textStyle: {
                                      fontSize: 15,
                                      color: normalColor,
                                    },
                                  },
                                },
                                labelLine: {
                                  normal: {
                                    show: false,
                                  },
                                },
                                data: [
                                  { value: order.disk.used, name: '已使用' },
                                  { value: order.disk.stock, name: '未使用' },
                                ],
                              },
                            ],
                          }}
                        />
                      </div>
                      <p>
                        <span className={styles.usedAndLimit}>
                          <span className={styles.tit}>已使用</span>
                          <br />
                          {sourceUtil.unit(order.disk.used, 'GB')}
                        </span>

                        <span className={styles.usedAndLimit}>
                          <span className={styles.tit}>已包月</span>
                          <br />
                          {sourceUtil.unit(order.disk.limit, 'GB')}
                        </span>

                        <span className={styles.usedAndLimit}>
                          <span className={styles.tit}>
                            按需计费{' '}
                            <Tooltip title="举例： 当前使用10G， 当前包月5G，则10G-5G=5G为按需计费的量">
                              <Icon type="info" />
                            </Tooltip>
                          </span>
                          <br />
                          {sourceUtil.unit(
                            order.disk.limit < order.disk.used
                              ? order.disk.used - order.disk.limit
                              : 0,
                            'GB',
                          )}
                        </span>
                      </p>
                    </Col>
                  </Row>
                  <p style={{ paddingTop: 24 }}>
                    <Link
                      to={`/team/${globalUtil.getCurrTeamName()}/region/${globalUtil.getCurrRegionName()}/resources/buy/${
                        order.name
                        }`}
                    >
                      <Button type="primary">{hasDate ? '修改包月' : '购买包月'}</Button>
                    </Link>
                  </p>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
    );
  }
}
