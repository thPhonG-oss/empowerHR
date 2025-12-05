package com.hr_management.hr_management.utils;

import inet.ipaddr.IPAddress;
import inet.ipaddr.IPAddressString;

public class IpUtils {
    public static boolean isIpInRange(String ip, String range) {
        IPAddress ipAddress = new IPAddressString(ip).getAddress();
        IPAddress subnet = new IPAddressString(range).getAddress();

        return subnet.contains(ipAddress);
    }
}
