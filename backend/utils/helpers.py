# from core.event_bus import event_bus


# def debug_packet_listener(packet):

#     print("PACKET EVENT:", packet)


# event_bus.subscribe("packet", debug_packet_listener)


from core.event_bus import event_bus


def debug_feature_listener(features):

    print("FEATURE EVENT:", features)


event_bus.subscribe("features", debug_feature_listener)