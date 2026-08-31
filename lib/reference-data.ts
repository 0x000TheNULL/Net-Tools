export const commonPorts = [
  [20, 'TCP', 'FTP data', 'Legacy file transfer data channel'],
  [21, 'TCP', 'FTP control', 'Legacy file transfer commands'],
  [22, 'TCP', 'SSH', 'Secure shell and SFTP'],
  [23, 'TCP', 'Telnet', 'Unencrypted remote terminal'],
  [25, 'TCP', 'SMTP', 'Mail relay'],
  [53, 'TCP/UDP', 'DNS', 'Domain name resolution'],
  [67, 'UDP', 'DHCP server', 'IPv4 address assignment'],
  [68, 'UDP', 'DHCP client', 'IPv4 address assignment'],
  [80, 'TCP', 'HTTP', 'Unencrypted web traffic'],
  [110, 'TCP', 'POP3', 'Legacy mailbox retrieval'],
  [123, 'UDP', 'NTP', 'Time synchronization'],
  [143, 'TCP', 'IMAP', 'Mailbox access'],
  [161, 'UDP', 'SNMP', 'Network monitoring'],
  [162, 'UDP', 'SNMP trap', 'Asynchronous monitoring events'],
  [389, 'TCP/UDP', 'LDAP', 'Directory services'],
  [443, 'TCP/UDP', 'HTTPS', 'TLS web traffic / HTTP/3'],
  [445, 'TCP', 'SMB', 'Windows file sharing'],
  [465, 'TCP', 'SMTPS', 'Implicit TLS mail submission'],
  [514, 'UDP', 'Syslog', 'System log transport'],
  [587, 'TCP', 'SMTP submission', 'Authenticated mail submission'],
  [636, 'TCP', 'LDAPS', 'TLS directory services'],
  [993, 'TCP', 'IMAPS', 'TLS mailbox access'],
  [995, 'TCP', 'POP3S', 'TLS mailbox retrieval'],
  [1433, 'TCP', 'MS SQL', 'Microsoft SQL Server'],
  [1521, 'TCP', 'Oracle DB', 'Oracle database listener'],
  [1812, 'UDP', 'RADIUS auth', 'Network access authentication'],
  [1813, 'UDP', 'RADIUS accounting', 'Network access accounting'],
  [3306, 'TCP', 'MySQL', 'MySQL database'],
  [3389, 'TCP/UDP', 'RDP', 'Remote Desktop Protocol'],
  [5432, 'TCP', 'PostgreSQL', 'PostgreSQL database'],
  [6379, 'TCP', 'Redis', 'In-memory data store'],
  [8080, 'TCP', 'HTTP alternate', 'Common application proxy port'],
] as const;

export const httpStatuses = [
  [100, 'Continue', 'Informational'], [101, 'Switching Protocols', 'Informational'],
  [200, 'OK', 'Success'], [201, 'Created', 'Success'], [202, 'Accepted', 'Success'], [204, 'No Content', 'Success'],
  [301, 'Moved Permanently', 'Redirection'], [302, 'Found', 'Redirection'], [304, 'Not Modified', 'Redirection'], [307, 'Temporary Redirect', 'Redirection'], [308, 'Permanent Redirect', 'Redirection'],
  [400, 'Bad Request', 'Client error'], [401, 'Unauthorized', 'Client error'], [403, 'Forbidden', 'Client error'], [404, 'Not Found', 'Client error'], [405, 'Method Not Allowed', 'Client error'], [409, 'Conflict', 'Client error'], [418, "I'm a Teapot", 'Client error'], [422, 'Unprocessable Content', 'Client error'], [429, 'Too Many Requests', 'Client error'],
  [500, 'Internal Server Error', 'Server error'], [501, 'Not Implemented', 'Server error'], [502, 'Bad Gateway', 'Server error'], [503, 'Service Unavailable', 'Server error'], [504, 'Gateway Timeout', 'Server error'],
] as const;

export const vlanRanges = [
  ['0', 'Reserved', 'Priority tagging only; not assigned to a VLAN.'],
  ['1', 'Default', 'Default VLAN on many switches; avoid for production traffic.'],
  ['2–1001', 'Normal range', 'Common access and trunk VLAN IDs.'],
  ['1002–1005', 'Legacy reserved', 'Historically reserved for FDDI and Token Ring.'],
  ['1006–4094', 'Extended range', 'Available with platform and VTP considerations.'],
  ['4095', 'Reserved', 'Implementation use; not assigned to a VLAN.'],
] as const;

export const ipRanges = [
  ['10.0.0.0/8', 'Private', 'RFC 1918'], ['172.16.0.0/12', 'Private', 'RFC 1918'],
  ['192.168.0.0/16', 'Private', 'RFC 1918'], ['100.64.0.0/10', 'Shared', 'Carrier-grade NAT'],
  ['127.0.0.0/8', 'Loopback', 'Local host'], ['169.254.0.0/16', 'Link-local', 'Automatic private addressing'],
  ['192.0.2.0/24', 'Documentation', 'TEST-NET-1'], ['198.51.100.0/24', 'Documentation', 'TEST-NET-2'],
  ['203.0.113.0/24', 'Documentation', 'TEST-NET-3'], ['224.0.0.0/4', 'Multicast', 'Group delivery'],
] as const;
